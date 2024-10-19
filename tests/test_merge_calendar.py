"""Tests for scripts/mergeCalendar.py. Run with: pytest"""
import importlib.util
from pathlib import Path

import pytest
from icalendar import Calendar

SCRIPT = Path(__file__).resolve().parent.parent / "scripts" / "mergeCalendar.py"


@pytest.fixture(scope="module")
def merge():
    spec = importlib.util.spec_from_file_location("mergeCalendar", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)  # must not run the merge on import
    return module


def ics(uid, summary, start="20240101T100000", end="20240101T110000"):
    return (
        "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//test//EN\r\n"
        "BEGIN:VEVENT\r\n"
        f"UID:{uid}\r\nSUMMARY:{summary}\r\nDTSTART:{start}\r\nDTEND:{end}\r\n"
        "LOCATION:Somewhere private\r\nDESCRIPTION:Should not be copied\r\n"
        "END:VEVENT\r\nEND:VCALENDAR\r\n"
    )


def read_events(path):
    cal = Calendar.from_ical(Path(path).read_bytes())
    return cal, [c for c in cal.walk("VEVENT")]


def test_merges_all_ics_files_in_a_folder(merge, tmp_path):
    folder = tmp_path / "calendars"
    folder.mkdir()
    (folder / "a.ics").write_text(ics("a-1", "Dentist"), encoding="utf-8")
    (folder / "b.ics").write_text(ics("b-1", "Meeting"), encoding="utf-8")
    (folder / "notes.txt").write_text("ignored", encoding="utf-8")
    out = tmp_path / "merged.ics"

    merge.merge_ics_files_from_sources([str(folder)], str(out))

    cal, events = read_events(out)
    assert sorted(str(e["SUMMARY"]) for e in events) == ["Dentist", "Meeting"]
    assert str(cal["X-WR-CALNAME"])


def test_merges_single_files_and_folders_together(merge, tmp_path):
    folder = tmp_path / "work"
    folder.mkdir()
    (folder / "w.ics").write_text(ics("w-1", "Daily Standup"), encoding="utf-8")
    single = tmp_path / "private.ics"
    single.write_text(ics("p-1", "Birthday"), encoding="utf-8")
    out = tmp_path / "merged.ics"

    merge.merge_ics_files_from_sources([str(folder), str(single)], str(out))

    _, events = read_events(out)
    assert {str(e["UID"]) for e in events} == {"w-1", "p-1"}


def test_only_keeps_essential_fields(merge, tmp_path):
    single = tmp_path / "one.ics"
    single.write_text(ics("x-1", "Haircut"), encoding="utf-8")
    out = tmp_path / "merged.ics"

    merge.merge_ics_files_from_sources([str(single)], str(out))

    _, events = read_events(out)
    assert len(events) == 1
    assert set(events[0].keys()) == {"SUMMARY", "DTSTART", "DTEND", "UID"}


def test_skips_invalid_sources_without_crashing(merge, tmp_path):
    good = tmp_path / "good.ics"
    good.write_text(ics("g-1", "Kept"), encoding="utf-8")
    out = tmp_path / "merged.ics"

    merge.merge_ics_files_from_sources(
        [str(tmp_path / "does-not-exist"), str(tmp_path / "readme.md"), str(good)], str(out)
    )

    _, events = read_events(out)
    assert [str(e["SUMMARY"]) for e in events] == ["Kept"]


def test_unreachable_url_is_skipped(merge, tmp_path, monkeypatch):
    class Response:
        status_code = 404
        content = b""

    monkeypatch.setattr(merge.requests, "get", lambda url: Response())
    out = tmp_path / "merged.ics"

    merge.merge_ics_files_from_sources(["https://example.com/missing.ics"], str(out))

    assert out.exists()
    _, events = read_events(out)
    assert events == []
