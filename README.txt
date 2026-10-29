AquaGuard live dashboard - leak alert update

Upload index.html to the root of your existing GitHub Pages repository, replacing the old index.html.
The page reads real ESP32 readings from Firebase at /waterMonitor/latest.json.

Leak alert rules:
- Idle mode checkbox is enabled by default. Keep it enabled only when no water use is expected; flow > 0.1 L/min raises a possible-leak alert immediately.
- Continuous flow > 0.1 L/min for 10 minutes raises a possible-leak alert.
- The 10-minute timer requires changing updatedAtMillis values from the ESP32. If readings stop changing, the timer pauses and reports that fresh data is missing.
- These are heuristic alerts, not proof of a leak. Normal water use can trigger them; turn idle mode off when water use is expected.

The Firebase database URL is entered in the dashboard and saved locally in the browser. The website reads /waterMonitor/latest.json.
