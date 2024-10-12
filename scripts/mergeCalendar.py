import os
import requests
from icalendar import Calendar, Event
from datetime import datetime

def merge_ics_files_from_sources(input_sources, output_file):
    # Erstelle einen neuen Kalender
    merged_calendar = Calendar(version="2.0")

    for source in input_sources:
        try:
            if source.startswith("http://") or source.startswith("https://"):
                # URL-basierte ICS-Datei herunterladen
                print(f"Verarbeite ICS-Datei von URL: {source}")
                response = requests.get(source)
                if response.status_code == 200:
                    # ICS-Inhalt von der URL laden
                    cal = Calendar.from_ical(response.content)
                    print(f"Datei von URL {source} erfolgreich heruntergeladen.")
                else:
                    print(f"Fehler beim Abrufen der Datei von {source}: HTTP {response.status_code}")
                    continue
            else:
                # Lokale Datei oder Ordner
                if os.path.isdir(source):
                    # Ordner durchsuchen und alle .ics-Dateien verarbeiten
                    print(f"Verarbeite ICS-Dateien im Ordner: {source}")
                    for filename in os.listdir(source):
                        file_path = os.path.join(source, filename)
                        if filename.endswith(".ics"):
                            with open(file_path, 'r', encoding='utf-8') as f:
                                cal = Calendar.from_ical(f.read())
                            print(f"Datei {filename} erfolgreich hinzugefügt.")
                            # Alle Events aus der ICS-Datei hinzufügen
                            for component in cal.subcomponents:
                                if isinstance(component, Event):
                                    # Vereinfachung der Event-Daten
                                    simplified_event = Event()

                                    # Nur die wesentlichen Felder hinzufügen
                                    simplified_event.add('SUMMARY', component.get('SUMMARY'))
                                    simplified_event.add('DTSTART', component.get('DTSTART'))
                                    simplified_event.add('DTEND', component.get('DTEND'))
                                    simplified_event.add('UID', component.get('UID'))

                                    # Das vereinfachte Event zum Kalender hinzufügen
                                    merged_calendar.add_component(simplified_event)
                elif os.path.isfile(source) and source.endswith(".ics"):
                    # Einzelne lokale ICS-Datei verarbeiten
                    with open(source, 'r', encoding='utf-8') as f:
                        cal = Calendar.from_ical(f.read())
                    print(f"Datei {source} erfolgreich hinzugefügt.")
                    # Alle Events aus der ICS-Datei hinzufügen
                    for component in cal.subcomponents:
                        if isinstance(component, Event):
                            # Vereinfachung der Event-Daten
                            simplified_event = Event()

                            # Nur die wesentlichen Felder hinzufügen
                            simplified_event.add('SUMMARY', component.get('SUMMARY'))
                            simplified_event.add('DTSTART', component.get('DTSTART'))
                            simplified_event.add('DTEND', component.get('DTEND'))
                            simplified_event.add('UID', component.get('UID'))

                            # Das vereinfachte Event zum Kalender hinzufügen
                            merged_calendar.add_component(simplified_event)
                else:
                    print(f"Quelle {source} ist weder ein gültiger Ordner noch eine .ics-Datei und wird übersprungen.")
                    continue

        except Exception as e:
            print(f"Fehler beim Verarbeiten der Quelle {source}: {e}")
    
    # Zusätzliche Felder am Ende des Kalenders hinzufügen
    merged_calendar.add('NAME', 'Daniel Kalender')
    merged_calendar.add('X-WR-CALNAME', 'Daniel Kalender')
    merged_calendar.add('METHOD', 'PUBLISH')

    # Speichern der zusammengeführten Kalenderdatei
    try:
        with open(output_file, 'wb') as f:
            f.write(merged_calendar.to_ical())
        print(f"Die Ereignisse wurden erfolgreich in {output_file} zusammengeführt.")
    except Exception as e:
        print(f"Fehler beim Speichern der zusammengeführten Datei: {e}")

# Eingabequellen (Liste von Ordnern und/oder URLs)
input_sources = [
    '/home/dany/.vdirsyncer/calendars/z-20160106-172024-160-002/', # Calendar
    '/home/dany/.vdirsyncer/calendars/0B04B6CD-CA03-4E0E-BC55-448E142320AC', # Arbeit
    '/home/dany/.vdirsyncer/calendars/8EFF4A11-5211-47EB-91A7-D566A7241293', # Arzttermine
    '/home/dany/.vdirsyncer/calendars/CD419CC5-8B3F-4EFE-A4B4-6C8158290028', # Aktienkalender
    'https://ics.tools/Feiertage/bayern.ics'
]

# Ausgabedatei
output_file = '/home/dany/MagicMirror/modules/Calendar/merged.ics'

# Zusammenführen der ICS-Dateien aus den Quellen (Ordner und/oder URLs)
merge_ics_files_from_sources(input_sources, output_file)
