from __future__ import annotations

from fastapi import APIRouter, Header

from app.config import get_settings
from app.services import supabase as sb
from app.routers.diagnose import demo_dashboard

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
async def stats(x_user_id: str | None = Header(default=None, alias="X-User-Id")) -> dict:
    settings = get_settings()
    client = sb.get_supabase(settings)
    if client and x_user_id:
        sb.ensure_demo_farm(client, x_user_id)
        return sb.dashboard_stats(client, x_user_id)
    return demo_dashboard()
