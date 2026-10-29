# AquaGuard — YUKTHI 2026 Prototype

A static, browser-based demonstration dashboard for water-use monitoring and rule-based alerting. It uses HTML, CSS, and vanilla JavaScript and can be hosted on GitHub Pages.

## Run locally
1. Download or clone this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in Chrome, Edge, or Firefox. No server or package installation is required.

## Deploy on GitHub Pages
1. Upload these files to the repository's root (not inside an extra nested folder).
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/(root)`, then save.
5. Wait for the Pages deployment to complete in the repository's Actions/Pages status.

## Features
- Dashboard overview of flow, estimated excess volume, alert priority, and monitored zones.
- Four demonstration scenarios: campus overview, normal usage, persistent nighttime flow, and tank overflow risk.
- Manual input form for zone, flow rate (L/min), tank level (%), continuous flow duration (minutes), and nighttime condition.
- Rule-based `NORMAL`, `WARNING`, and `URGENT` results with reasons and recommended actions.
- Zone filter and CSV export.
- Responsive layout for laptop and mobile screens.

## Demonstration rules
- **URGENT:** tank level is at least 95% while flow is greater than zero.
- **WARNING:** nighttime flow continues for at least 60 minutes, or flow rate is at least 10 L/min.
- **NORMAL:** none of the alert rules above are triggered.

Estimated volume during a flagged interval is calculated as `flow rate (L/min) × entered duration (minutes)`. This is an illustrative estimate and not a calibrated measurement of water loss.

## Important limitation
This is a software prototype using manually entered or simulated values. It does not connect to physical sensors, and the thresholds are demonstration rules that should be validated against measured data before operational use.
