#!/usr/bin/env python
from __future__ import annotations
from pathlib import Path
import sys, pandas as pd
from backend.config import PROCESSED_DIR
def fail(msg: str) -> None:
    print(f"[FAIL] {msg}")
    sys.exit(1)
def main():
    path = PROCESSED_DIR / "hitters_season.csv"
    if not path.exists():
        fail(f"Missing processed file: {path}")
    df = pd.read_csv(path)
    required = {"batter","player_name","season","PA","AB","H","AVG","OBP","SLG"}
    if not required.issubset(df.columns):
        fail(f"Missing required columns: {sorted(required - set(df.columns))}")
    if len(df) == 0:
        fail("No rows in processed table.")
    print(f"[OK] {len(df)} rows; validations passed.")
if __name__ == "__main__":
    main()
