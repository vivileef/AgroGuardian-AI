from __future__ import annotations

from typing import Any

from supabase import Client, create_client

from app.config import Settings


def get_supabase(settings: Settings) -> Client | None:
    if not settings.has_supabase:
        return None
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def upsert_profile(client: Client, user_id: str, full_name: str | None = None) -> None:
    payload: dict[str, Any] = {"id": user_id}
    if full_name:
        payload["full_name"] = full_name
    client.table("profiles").upsert(payload).execute()


def ensure_demo_farm(client: Client, user_id: str) -> None:
    upsert_profile(client, user_id, "Agricultor")
    existing = client.table("farms").select("id").eq("owner_id", user_id).limit(1).execute()
    if existing.data:
        return

    client.table("farms").insert(
        {
            "owner_id": user_id,
            "name": "Finca La Esperanza",
            "lat": -1.0547,
            "lng": -80.4545,
            "area_ha": 12.5,
            "health_status": "riesgo",
        }
    ).execute()

    farm = client.table("farms").select("id").eq("owner_id", user_id).limit(1).execute()
    if not farm.data:
        return
    farm_id = farm.data[0]["id"]

    crops = [
        {"farm_id": farm_id, "name": "Plátano Barraganete", "variety": "Barraganete", "growth_stage": "Floración", "health_pct": 72, "status": "riesgo"},
        {"farm_id": farm_id, "name": "Cacao Nacional", "variety": "Nacional", "growth_stage": "Producción", "health_pct": 91, "status": "sano"},
        {"farm_id": farm_id, "name": "Maíz duro", "variety": "INIAP", "growth_stage": "Vegetativo", "health_pct": 88, "status": "sano"},
        {"farm_id": farm_id, "name": "Café arábiga", "variety": "Arábiga", "growth_stage": "Crecimiento", "health_pct": 64, "status": "infectado"},
        {"farm_id": farm_id, "name": "Arroz INIAP", "variety": "INIAP", "growth_stage": "Macollamiento", "health_pct": 85, "status": "sano"},
        {"farm_id": farm_id, "name": "Plátano Dominico", "variety": "Dominico", "growth_stage": "Desarrollo", "health_pct": 79, "status": "riesgo"},
    ]
    client.table("crops").insert(crops).execute()


def list_farms(client: Client, user_id: str) -> list[dict[str, Any]]:
    res = client.table("farms").select("id,name,lat,lng,health_status").eq("owner_id", user_id).execute()
    return [
        {
            "id": row["id"],
            "name": row["name"],
            "lat": row.get("lat"),
            "lng": row.get("lng"),
            "status": row.get("health_status", "sano"),
        }
        for row in (res.data or [])
    ]


def list_crops(client: Client, user_id: str) -> list[dict[str, Any]]:
    farms = client.table("farms").select("id").eq("owner_id", user_id).execute()
    farm_ids = [f["id"] for f in (farms.data or [])]
    if not farm_ids:
        return []

    res = (
        client.table("crops")
        .select("id,name,variety,growth_stage,health_pct,status,plot_id,farm_id")
        .in_("farm_id", farm_ids)
        .execute()
    )
    plots = client.table("plots").select("id,area_ha").in_("farm_id", farm_ids).execute()
    plot_areas = {p["id"]: float(p.get("area_ha") or 1) for p in (plots.data or [])}

    out: list[dict[str, Any]] = []
    for row in res.data or []:
        plot_id = row.get("plot_id")
        out.append(
            {
                "id": row["id"],
                "name": row["name"],
                "variety": row.get("variety"),
                "stage": row.get("growth_stage") or "—",
                "health": row.get("health_pct") or 80,
                "status": row.get("status") or "sano",
                "hectares": plot_areas.get(plot_id, 1.0) if plot_id else 1.0,
            }
        )
    return out


def dashboard_stats(client: Client, user_id: str) -> dict[str, Any]:
    crops = list_crops(client, user_id)
    detections = (
        client.table("detections")
        .select("id,risk_level")
        .eq("owner_id", user_id)
        .execute()
    )
    det_rows = detections.data or []
    infected = len([c for c in crops if c["status"] != "sano"])
    avg_health = round(sum(c["health"] for c in crops) / len(crops)) if crops else 0

    sano = len([c for c in crops if c["status"] == "sano"])
    riesgo = len([c for c in crops if c["status"] == "riesgo"])
    infect = len([c for c in crops if c["status"] == "infectado"])
    total = len(crops) or 1

    return {
        "active_crops": len(crops),
        "detected_cases": max(infected, len(det_rows)),
        "climate_risk": "alto",
        "avg_health": avg_health,
        "crop_status": {
            "healthy": round((sano / total) * 100),
            "risk": round((riesgo / total) * 100),
            "infected": round((infect / total) * 100),
        },
    }


def save_detection(
    client: Client,
    user_id: str,
    result: dict[str, Any],
    *,
    storage_path: str | None = None,
) -> None:
    det = result["detection"]
    detection_row = {
        "owner_id": user_id,
        "disease": det["disease"],
        "confidence": det["confidence"],
        "risk_level": det["risk_level"],
        "affected_part": det.get("affected_part"),
        "rationale": det.get("rationale"),
        "agent_trace": result.get("agent_trace", []),
    }
    if storage_path:
        img = client.table("images").insert(
            {"owner_id": user_id, "storage_path": storage_path, "mime": "image/jpeg"}
        ).execute()
        if img.data:
            detection_row["image_id"] = img.data[0]["id"]

    ins = client.table("detections").insert(detection_row).execute()
    if not ins.data:
        return
    detection_id = ins.data[0]["id"]

    recs = [
        {
            "detection_id": detection_id,
            "title": r["title"],
            "detail": r["detail"],
            "priority": r.get("priority", 1),
            "timeframe": r.get("timeframe"),
        }
        for r in result.get("recommendations", [])
    ]
    if recs:
        client.table("recommendations").insert(recs).execute()

    client.table("notifications").insert(
        {
            "owner_id": user_id,
            "title": f"{det['disease']} detectada",
            "body": f"{det['crop']} · confianza {int(det['confidence'] * 100)}%",
            "severity": det["risk_level"],
        }
    ).execute()


def list_detections(client: Client, user_id: str, limit: int = 50) -> list[dict[str, Any]]:
    res = (
        client.table("detections")
        .select("*")
        .eq("owner_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return res.data or []
