# AquaGuard: Intelligent Water-Waste Monitoring System 💧
**Theme:** Sustainable Development (UN SDG 6: Clean Water and Sanitation)  
**Hackathon:** YUKTHI 2026 | **Team:** Idea Igniters  
**Team Members:** K Rajashekar, M Naga Jasnavi Goud, S Akifa, Haswanth Sai, B Sujith Kumar

---

## 📌 Overview
AquaGuard is an explainable decision-support and anomaly detection system engineered to detect micro-leaks, overnight continuous flows, and tank overflow hazards in shared facilities (college hostels, educational institutions, apartments).

---

## 🚀 Repository Structure
- `index.html`: Fully interactive browser dashboard prototype (Tailwind CSS, Chart.js).
- `firmware/esp32_sensor_node.ino`: Arduino/C++ firmware for ESP32 with YF-S201 flow sensor and HC-SR04 ultrasonic sensor.
- `simulator/telemetry_sim.py`: Python rule engine & volumetric loss calculator ($Excess\ Loss = (Flow - Baseline) \times Duration$).
- `package.json`: NPM package metadata and local server script.
- `LICENSE`: MIT License.

---

## 🛠️ How to Run
1. **Frontend Prototype**: Double-click `index.html` to run in any browser.
2. **Python Simulator**: Run `python simulator/telemetry_sim.py`.
3. **ESP32 Firmware**: Open `firmware/esp32_sensor_node.ino` in Arduino IDE or PlatformIO.
