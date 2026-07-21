from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter(prefix="/api/markets", tags=["markets"])

# Precios de referencia Manabí / Ecuador (demo — conectar MAG/FAOSTAT en producción)
_PRICES = [
    {"crop": "Plátano", "price_usd": 0.42, "unit": "kg", "trend": "up", "market": "Portoviejo"},
    {"crop": "Cacao", "price_usd": 3.15, "unit": "kg", "trend": "stable", "market": "Manta"},
    {"crop": "Maíz", "price_usd": 0.38, "unit": "kg", "trend": "down", "market": "Chone"},
    {"crop": "Café", "price_usd": 4.80, "unit": "kg", "trend": "up", "market": "Jipijapa"},
    {"crop": "Arroz", "price_usd": 0.55, "unit": "kg", "trend": "stable", "market": "Portoviejo"},
    {"crop": "Banano orgánico", "price_usd": 0.68, "unit": "kg", "trend": "up", "market": "Exportación"},
]


@router.get("/prices")
async def market_prices() -> list[dict]:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return [{**p, "updated": now} for p in _PRICES]
