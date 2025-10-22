.PHONY: dev etl full validate report clean
dev:
	python3 -m venv .venv || true
	. .venv/bin/activate && pip install --upgrade pip && pip install -r backend/requirements.txt
etl:
	. .venv/bin/activate && python scripts/run_etl.py --mode incremental
full:
	. .venv/bin/activate && python scripts/run_etl.py --mode full --season 2025
report:
	. .venv/bin/activate && python scripts/run_etl.py --report_player_id 592450 --report_season 2025
validate:
	. .venv/bin/activate && python scripts/validate_and_publish.py
clean:
	rm -rf .venv data
