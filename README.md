# AquaGuard — Intelligent Water-Waste Monitoring System

**Tagline:** Detect. Quantify. Prioritize. Save.  
**Team:** Idea Igniters · YUKTHI 2026 Hackathon  
**Theme:** Sustainable Development

## Overview
AquaGuard is a browser-based water-waste monitoring and decision-support prototype for college hostels, campuses, and residential apartments. It demonstrates how simulated flow and tank-level readings can be turned into understandable alerts and recommended maintenance actions.

## Problem
Hidden pipe leaks, tank overflow, and unusual nighttime flow can go unnoticed when facilities rely only on manual inspections.

## Features
- Dashboard with total flow, estimated excess loss, and highest priority
- Three monitored demo zones: kitchen, hostel bathrooms, and overhead tank
- Scenario selector for normal use, nighttime abnormal flow, and tank overflow risk
- Explainable JavaScript rule engine
- Priority score from 0–100
- Recommended maintenance actions
- Zone filter and CSV export
- Responsive desktop and mobile layout

## Technology
- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages (optional static hosting)

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Select a scenario from **Demo Scenario**.
4. Click **Run analysis** to refresh the demo output.
5. Use **Export readings CSV** to download the current scenario data.

No build tools or dependencies are required.

## Demo scenarios
- **Normal water usage:** all zones have normal status.
- **Persistent nighttime flow:** bathroom flow persists for 60 minutes at night and produces a warning.
- **Tank overflow risk:** the tank is 99% full while inlet flow is active, producing an urgent alert.
- **Campus overview:** combines normal, warning, and urgent conditions.

## Important limitations
This prototype uses simulated readings only. It is not connected to physical sensors, does not automatically shut off pumps, and does not prove actual water savings. The example thresholds, priority scores, and loss values are demonstration values. They must be calibrated and validated with real measurements before operational use.

## Future scope
- ESP32 telemetry via Wi-Fi
- Water flow sensor and tank-level sensor integration
- Secure backend storage and historical analytics
- SMS or app notifications
- Controlled testing and a hostel pilot

## Team
Idea Igniters — YUKTHI 2026 Hackathon
