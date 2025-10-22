from __future__ import annotations
import datetime as dt
import pandas as pd
from pathlib import Path
from backend.sequence_src.scrape_savant import fetch_batter_statcast, lookup_batter_id
from .config import ensure_dirs, PROCESSED_DIR, WATERMARKS_PATH, FRESHNESS_PATH, read_json, write_json

def _today_str(): return dt.date.today().isoformat()
def _default_since(days=3): return (dt.date.today() - dt.timedelta(days=days)).isoformat()
def _load_watermarks(): return read_json(WATERMARKS_PATH, {"statcast_since": _default_since(3)})
def _save_watermarks(wm): write_json(WATERMARKS_PATH, wm)
def _mark_fresh(table):
    meta = read_json(FRESHNESS_PATH, {})
    meta[table] = {"last_updated": dt.datetime.utcnow().isoformat()+"Z"}
    write_json(FRESHNESS_PATH, meta)

def _normalize_hitters(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return pd.DataFrame(columns=["batter","player_name","season","PA","AB","H","BB","HBP","SF","TB","AVG","OBP","SLG"])
    use_cols = ["batter","player_name","game_date","events","pitch_number","at_bat_number","game_pk"]
    df = df[use_cols].copy()
    df["season"] = pd.to_datetime(df["game_date"]).dt.year
    last = (
        df.sort_values(["game_pk","at_bat_number","pitch_number"])
          .drop_duplicates(["game_pk","at_bat_number","batter"], keep="last")
    )
    ev = last["events"].astype(str).str.lower()
    tb_map = {"single":1,"double":2,"triple":3,"home_run":4}
    is_bb   = ev.isin({"walk","intent_walk"})
    is_hbp  = ev.eq("hit_by_pitch")
    is_sf   = ev.eq("sac_fly")
    is_sh   = ev.eq("sac_bunt")
    is_ci   = ev.eq("catcher_interference") | ev.eq("catcher_interf")
    is_hit  = ev.isin(tb_map)
    is_ab   = (~(is_bb | is_hbp | is_sf | is_sh | is_ci)) & ev.ne("nan")
    last["tb"] = ev.map(tb_map).fillna(0)
    last["is_ab"] = is_ab
    last["is_hit"] = is_hit
    last["is_bb"] = is_bb
    last["is_hbp"] = is_hbp
    last["is_sf"] = is_sf
    g = (
        last.groupby(["batter","season"], dropna=False)
            .agg(player_name=("player_name","first"),
                 PA=("batter","size"),
                 AB=("is_ab","sum"),
                 H =("is_hit","sum"),
                 BB=("is_bb","sum"),
                 HBP=("is_hbp","sum"),
                 SF=("is_sf","sum"),
                 TB=("tb","sum"))
            .reset_index()
    )
    g["AVG"] = (g["H"]/g["AB"].clip(lower=1)).round(3)
    g["OBP"] = ((g["H"]+g["BB"]+g["HBP"]) / (g["AB"]+g["BB"]+g["HBP"]+g["SF"]).clip(lower=1)).round(3)
    g["SLG"] = (g["TB"]/g["AB"].clip(lower=1)).round(3)
    return g[["batter","player_name","season","PA","AB","H","AVG","OBP","SLG"]]

def run(mode: str="incremental", season: int|None=None) -> Path:
    ensure_dirs()
    wm = _load_watermarks()
    if mode=="full":
        if season is None: raise SystemExit("--season required for full")
        start_dt, end_dt = f"{season}-03-01", f"{season}-10-31"
    elif mode in ("incremental","auto"):
        start_dt, end_dt = wm.get("statcast_since", _default_since(3)), _today_str()
    else:
        raise SystemExit(f"Unknown mode: {mode}")
    batter_id = 624413
    try:
        pid = lookup_batter_id("Pete Alonso")
        if pd.notna(pid): batter_id = int(pid)
    except Exception:
        pass
    df = fetch_batter_statcast(batter_id, start_dt, end_dt)
    if 'game_type' in df.columns:
        df = df[df['game_type'].astype(str).str.upper().eq('R')].copy()
    hitters = _normalize_hitters(df)
    out_csv = PROCESSED_DIR / "hitters_season.csv"
    hitters.to_csv(out_csv, index=False)
    wm["statcast_since"] = end_dt
    _save_watermarks(wm)
    _mark_fresh("hitters_season")
    return out_csv
