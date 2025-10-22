from __future__ import annotations
import os, json
from pathlib import Path
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass
ROOT = Path(os.getcwd())
DATA_DIR = Path(os.getenv("SEQUENCE_BIOLAB_DATA_DIR", "data")).resolve()
CACHE_DIR = Path(os.getenv("SEQUENCE_BIOLAB_CACHE_DIR", DATA_DIR / "cache")).resolve()
RAW_DIR = CACHE_DIR / "raw"
META_DIR = DATA_DIR / "_meta"
PROCESSED_DIR = DATA_DIR / "processed"
REPORTS_DIR = DATA_DIR / "reports"
def ensure_dirs() -> None:
    for p in [DATA_DIR, CACHE_DIR, RAW_DIR, META_DIR, PROCESSED_DIR, REPORTS_DIR]:
        Path(p).mkdir(parents=True, exist_ok=True)
WATERMARKS_PATH = META_DIR / "watermarks.json"
FRESHNESS_PATH = META_DIR / "data_freshness.json"
def read_json(path: Path, default):
    try:
        return json.loads(Path(path).read_text())
    except Exception:
        return default
def write_json(path: Path, obj) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2))
