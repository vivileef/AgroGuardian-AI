from __future__ import annotations

from fastapi import APIRouter, Header

from app.config import get_settings
from app.services import supabase as sb

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/sync")
async def sync_user(
    body: dict | None = None,
    x_user_id: str | None = Header(default=None, alias="X-User-Id"),
) -> dict:
    if not x_user_id:
        return {"ok": False, "reason": "no user id"}

    settings = get_settings()
    client = sb.get_supabase(settings)
    if client is None:
        return {"ok": True, "mode": "demo"}

    name = (body or {}).get("full_name")
    sb.upsert_profile(client, x_user_id, name)
    sb.ensure_demo_farm(client, x_user_id)
    return {"ok": True, "user_id": x_user_id}
