from __future__ import annotations
from pathlib import Path
import hashlib
import pandas as pd
from pybaseball import statcast_pitcher, statcast_batter
import statsapi

CACHE_DIR = Path("build/cache/savant")
CACHE_DIR.mkdir(parents=True, exist_ok=True)

def _hash_key(*parts) -> Path:
    h = hashlib.sha256("|".join(map(str, parts)).encode()).hexdigest()
    return CACHE_DIR / f"{h}.parquet"

def fetch_pitcher_statcast(pitcher_id: int, start: str, end: str) -> pd.DataFrame:
    key = _hash_key("pitcher", pitcher_id, start, end)
    if key.exists():
        return pd.read_parquet(key)
    df = statcast_pitcher(start, end, pitcher_id)
    if df is None:
        df = pd.DataFrame()
    df.to_parquet(key, index=False)
    return df

def lookup_batter_id(name: str) -> int:
    people = statsapi.lookup_player(name)
    if not people:
        raise ValueError(f"Could not locate MLBAM id for hitter: {name}")
    return int(people[0]["id"])

def fetch_batter_statcast(batter_id: int, start: str, end: str) -> pd.DataFrame:
    key = _hash_key("batter", batter_id, start, end)
    if key.exists():
        return pd.read_parquet(key)
    df = statcast_batter(start, end, batter_id)
    if df is None:
        df = pd.DataFrame()
    df.to_parquet(key, index=False)
    return df
