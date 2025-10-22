from __future__ import annotations
import json, datetime as dt
from pathlib import Path
import pandas as pd
from .config import ensure_dirs, RAW_DIR, PROCESSED_DIR, WATERMARKS_PATH, FRESHNESS_PATH, read_json, write_json
def _today_str() -> str:
    return dt.date.today().isoformat()
def _default_since(days:int=3) -> str:
    return (dt.date.today() - dt.timedelta(days=days)).isoformat()
def _load_watermarks() -> dict:
    return read_json(WATERMARKS_PATH, {"statcast_since": _default_since(3)})
def _save_watermarks(wm: dict) -> None:
    write_json(WATERMARKS_PATH, wm)
def _mark_fresh(table: str) -> None:
    meta = read_json(FRESHNESS_PATH, {})
    meta[table] = {"last_updated": dt.datetime.utcnow().isoformat() + "Z"}
    write_json(FRESHNESS_PATH, meta)
def _fetch_statcast(start_dt: str, end_dt: str) -> pd.DataFrame:
    from pybaseball import statcast
    df = statcast(start_dt=start_dt, end_dt=end_dt)
    raw_path = RAW_DIR / "statcast" / f"{start_dt}_to_{end_dt}.csv"
    raw_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(raw_path, index=False)
    return df
def _normalize_hitters(df: pd.DataFrame) -> pd.DataFrame:
    if df.empty:
        return pd.DataFrame(columns=["batter","player_name","season","PA","AB","H","AVG","OBP","SLG"])
    df = df.copy()
    df["season"] = pd.to_datetime(df["game_date"]).dt.year
    df["is_ab"] = (df["events"].notna()) & (~df["events"].isin(["walk","hit_by_pitch","catcher_interf","intent_walk"]))
    df["hit"]  = df["events"].isin(["single","double","triple","home_run"])
    tb_map = {"single":1,"double":2,"triple":3,"home_run":4}
    df["tb"] = df["events"].map(tb_map).fillna(0)
    g = df.groupby(["batter","player_name","season"], dropna=False).agg(
        PA=("pitch_number","count"),
        AB=("is_ab","sum"),
        H=("hit","sum"),
        TB=("tb","sum"),
        BB=(lambda x: (df.loc[x.index,"events"]=="walk").sum()),
        HBP=(lambda x: (df.loc[x.index,"events"]=="hit_by_pitch").sum())
    ).reset_index()
    g["AVG"] = (g["H"] / g["AB"].clip(lower=1)).round(3)
    g["OBP"] = ((g["H"] + g["BB"] + g["HBP"]) / (g["PA"].clip(lower=1))).round(3)
    g["SLG"] = (g["TB"] / g["AB"].clip(lower=1)).round(3)
    return g[["batter","player_name","season","PA","AB","H","AVG","OBP","SLG"]].sort_values(["season","PA"], ascending=[False,False])
def run(mode: str="incremental", season: int | None=None) -> Path:
    ensure_dirs()
    wm = _load_watermarks()
    if mode == "full":
        if season is None:
            raise SystemExit("--season required for full")
        start_dt = f"{season}-01-01"
        end_dt   = f"{season}-12-31"
    elif mode in ("incremental","auto"):
        start_dt = wm.get("statcast_since", _default_since(3))
        end_dt   = _today_str()
    else:
        raise SystemExit(f"Unknown mode: {mode}")
    df = _fetch_statcast(start_dt, end_dt)
    hitters = _normalize_hitters(df)
    out_csv = PROCESSED_DIR / "hitters_season.csv"
    if out_csv.exists():
        old = pd.read_csv(out_csv)
        merged = pd.concat([old, hitters], ignore_index=True)
        merged = merged.sort_values(["season"]).drop_duplicates(["batter","season"], keep="last")
        merged.to_csv(out_csv, index=False)
    else:
        hitters.to_csv(out_csv, index=False)
    wm["statcast_since"] = end_dt
    _save_watermarks(wm)
    _mark_fresh("hitters_season")
    return out_csv
