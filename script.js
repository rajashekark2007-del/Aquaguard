const ZONES = {
  kitchen: { id: "kitchen", name: "Zone A · Kitchen", short: "Kitchen", sub: "Food preparation area" },
  bathrooms: { id: "bathrooms", name: "Zone B · Hostel Bathrooms", short: "Hostel bathrooms", sub: "Shared washrooms" },
  tank: { id: "tank", name: "Zone C · Overhead Tank", short: "Overhead tank", sub: "Tank inlet monitoring" }
};

const SCENARIOS = {
  normal: [
    { ...ZONES.kitchen, flow: 4.0, tankLevel: 48, loss: 0, score: 12, status: "NORMAL", reason: "Usage is within the expected baseline.", action: "Continue routine monitoring.", continuousFlowMinutes: 0, isNight: false },
    { ...ZONES.bathrooms, flow: 2.2, tankLevel: 50, loss: 0, score: 10, status: "NORMAL", reason: "No sustained abnormal flow detected.", action: "Continue routine monitoring.", continuousFlowMinutes: 0, isNight: false },
    { ...ZONES.tank, flow: 0.0, tankLevel: 72, loss: 0, score: 8, status: "NORMAL", reason: "Tank level is stable and inlet flow is off.", action: "No action required.", continuousFlowMinutes: 0, isNight: false }
  ],
  leak: [
    { ...ZONES.kitchen, flow: 4.0, tankLevel: 48, loss: 0, score: 12, status: "NORMAL", reason: "Usage is within the expected baseline.", action: "Continue routine monitoring.", continuousFlowMinutes: 0, isNight: false },
    { ...ZONES.bathrooms, flow: 0.5, tankLevel: 50, loss: 30, score: 68, status: "WARNING", reason: "Continuous low flow for 60 minutes during nighttime.", action: "Inspect flush valves, taps, and concealed plumbing.", continuousFlowMinutes: 60, isNight: true },
    { ...ZONES.tank, flow: 0.0, tankLevel: 72, loss: 0, score: 8, status: "NORMAL", reason: "Tank level is stable and inlet flow is off.", action: "No action required.", continuousFlowMinutes: 0, isNight: false }
  ],
  overflow: [
    { ...ZONES.kitchen, flow: 4.0, tankLevel: 48, loss: 0, score: 12, status: "NORMAL", reason: "Usage is within the expected baseline.", action: "Continue routine monitoring.", continuousFlowMinutes: 0, isNight: false },
    { ...ZONES.bathrooms, flow: 2.2, tankLevel: 50, loss: 0, score: 10, status: "NORMAL", reason: "No sustained abnormal flow detected.", action: "Continue routine monitoring.", continuousFlowMinutes: 0, isNight: false },
    { ...ZONES.tank, flow: 15.0, tankLevel: 99, loss: 150, score: 95, status: "URGENT", reason: "Tank is 99% full while inlet flow remains active.", action: "Check the inlet pump and float valve; stop the inlet if safe.", continuousFlowMinutes: 10, isNight: false }
  ],
  mixed: [
    { ...ZONES.kitchen, flow: 4.0, tankLevel: 48, loss: 0, score: 12, status: "NORMAL", reason: "Usage is within the expected baseline.", action: "Continue routine monitoring.", continuousFlowMinutes: 0, isNight: false },
    { ...ZONES.bathrooms, flow: 0.5, tankLevel: 50, loss: 30, score: 68, status: "WARNING", reason: "Continuous low flow for 60 minutes during nighttime.", action: "Inspect flush valves, taps, and concealed plumbing.", continuousFlowMinutes: 60, isNight: true },
    { ...ZONES.tank, flow: 15.0, tankLevel: 99, loss: 150, score: 95, status: "URGENT", reason: "Tank is 99% full while inlet flow remains active.", action: "Check the inlet pump and float valve; stop the inlet if safe.", continuousFlowMinutes: 10, isNight: false }
  ]
};

let currentScenario = "mixed";
let activeView = "overview";
let analysisCount = 0;
let toastTimer;

const $ = (id) => document.getElementById(id);
const copyZones = (scenario) => SCENARIOS[scenario].map(zone => ({ ...zone }));

// Explicit, explainable rule engine. Scenario records are demo inputs; rules assign status and action.
function evaluateReading(reading) {
  if (reading.tankLevel >= 95 && reading.flow > 0) {
    return { status: "URGENT", score: 95, reason: `Tank is ${reading.tankLevel}% full while inlet flow remains active.`, action: "Check the inlet pump and float valve; stop the inlet if safe." };
  }
  if (reading.isNight && reading.continuousFlowMinutes >= 60 && reading.flow > 0) {
    return { status: "WARNING", score: 68, reason: `Continuous flow for ${reading.continuousFlowMinutes} minutes during nighttime.`, action: "Inspect flush valves, taps, and concealed plumbing." };
  }
  return { status: "NORMAL", score: 12, reason: "Usage is within the expected baseline.", action: "Continue routine monitoring." };
}

function getZones() {
  // Apply rule engine to inputs so the displayed result is computed, not merely hard-coded.
  return copyZones(currentScenario).map(zone => {
    const result = evaluateReading({
      tankLevel: zone.tankLevel,
      flow: zone.flow,
      isNight: zone.isNight,
      continuousFlowMinutes: zone.continuousFlowMinutes
    });
    // Preserve designed baseline scores for normal zones.
    if (result.status === "NORMAL") return { ...zone, status: "NORMAL", reason: zone.reason, action: zone.action };
    return { ...zone, ...result };
  });
}

function statusClass(status) { return status.toLowerCase(); }
function statusPill(status) { return `<span class="status-pill ${statusClass(status)}">${status}</span>`; }
function safeText(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function filteredZones(zones) {
  const filter = $("zone-filter").value;
  return filter === "all" ? zones : zones.filter(zone => zone.id === filter);
}
function renderMetrics(zones) {
  $("metric-flow").textContent = zones.reduce((sum, z) => sum + z.flow, 0).toFixed(1);
  $("metric-loss").textContent = zones.reduce((sum, z) => sum + z.loss, 0);
  const highest = Math.max(...zones.map(z => z.score));
  $("metric-priority").textContent = highest;
  $("metric-prio-label").textContent = highest >= 85 ? "Urgent inspection" : highest >= 50 ? "Warning · inspect soon" : "Routine monitoring";
  $("metric-zones").textContent = zones.length;
  $("sidebar-alert-count").textContent = zones.filter(z => z.status !== "NORMAL").length;
}
function renderChart(zones) {
  const values = [0,1,2,3,4,5].map(i => zones.reduce((sum,z) => sum + z.flow, 0) * ([0.66,0.73,0.69,0.82,0.76,1][i]));
  const svg = $("flow-chart");
  const left = 40, right = 620, top = 18, bottom = 190, max = Math.max(20, Math.ceil(Math.max(...values) / 5) * 5);
  const points = values.map((v,i) => ({ x: left + i * ((right-left)/5), y: bottom - (v/max)*(bottom-top), v }));
  const grid = [0,1,2,3,4].map(i => {
    const y = top + i*((bottom-top)/4);
    return `<line class="chart-grid" x1="${left}" y1="${y}" x2="${right}" y2="${y}"/><text class="chart-label" x="4" y="${y+4}">${Math.round(max*(4-i)/4)}</text>`;
  }).join("");
  const labels = ["06:00","08:00","10:00","12:00","14:00","Now"].map((t,i) => `<text class="chart-label" text-anchor="middle" x="${points[i].x}" y="216">${t}</text>`).join("");
  const polyline = points.map(p => `${p.x},${p.y}`).join(" ");
  svg.innerHTML = `<defs><linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#2585e8" stop-opacity=".22"/><stop offset="100%" stop-color="#2585e8" stop-opacity="0"/></linearGradient></defs>
    ${grid}<polygon class="chart-area" points="${left},${bottom} ${polyline} ${right},${bottom}"/><polyline class="chart-line" points="${polyline}"/>
    ${points.map(p=>`<circle class="chart-point" cx="${p.x}" cy="${p.y}" r="4"/>`).join("")}${labels}`;
}
function renderPriority(zones) {
  $("priority-bars").innerHTML = zones.map(z => {
    const cls = statusClass(z.status);
    return `<div class="priority-row"><div class="priority-top"><span>${safeText(z.short)}</span><strong>${z.score}/100</strong></div><div class="track"><span class="${cls}-fill" style="width:${Math.max(3,z.score)}%"></span></div></div>`;
  }).join("");
}
function renderTable(zones) {
  const shown = filteredZones(zones);
  $("zone-count").textContent = `${shown.length} ZONE${shown.length===1?"":"S"}`;
  $("zone-table").innerHTML = shown.map(z => `<tr>
    <td><span class="zone-name">${safeText(z.name)}</span><span class="zone-sub">${safeText(z.sub)}</span></td>
    <td>${z.flow.toFixed(1)} L/min</td><td>${z.tankLevel}%</td><td>${z.loss} L</td>
    <td><span class="score">${z.score}</span><span class="zone-sub">out of 100</span></td><td>${statusPill(z.status)}</td>
    <td class="action-cell">${safeText(z.action)}</td></tr>`).join("") || `<tr><td colspan="7" class="empty-state">No zones match this filter.</td></tr>`;
}
function renderAlerts(zones) {
  const alerts = zones.filter(z => z.status !== "NORMAL").sort((a,b)=>b.score-a.score);
  const all = zones.slice().sort((a,b)=>b.score-a.score);
  const rows = activeView === "alerts" ? all : alerts;
  $("alert-list").innerHTML = rows.length ? rows.map(z => {
    const cls = statusClass(z.status);
    const symbol = z.status === "URGENT" ? "!" : z.status === "WARNING" ? "△" : "✓";
    return `<article class="alert-item"><div class="alert-symbol ${cls}">${symbol}</div><div><h3>${safeText(z.short)} · ${safeText(z.status)}</h3><p>${safeText(z.reason)} ${safeText(z.action)}</p></div><span class="alert-time">Score ${z.score}/100</span></article>`;
  }).join("") : `<div class="empty-state">No abnormal readings in this scenario. All monitored zones are normal.</div>`;
}
function render() {
  const zones = getZones();
  renderMetrics(zones);
  renderChart(zones);
  renderPriority(zones);
  renderTable(zones);
  renderAlerts(zones);
}
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function setView(view) {
  activeView = view;
  document.body.classList.remove("view-overview", "view-zones", "view-alerts");
  document.body.classList.add(`view-${view}`);
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  $("page-title").textContent = view === "overview" ? "Water intelligence overview" : view === "zones" ? "Zone monitoring" : "Alerts & recommended actions";
  render();
}
function exportCSV() {
  const zones = getZones();
  const header = ["zone","flow_l_min","tank_level_percent","estimated_excess_loss_litres","priority_score","status","reason","recommended_action"];
  const rows = zones.map(z => [z.name,z.flow,z.tankLevel,z.loss,z.score,z.status,z.reason,z.action]);
  const csv = [header, ...rows].map(row => row.map(value => `"${String(value).replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = "aquaguard-demo-readings.csv"; link.click();
  URL.revokeObjectURL(url);
  showToast("Demo readings exported as CSV.");
}

$("scenario-select").addEventListener("change", event => {
  currentScenario = event.target.value;
  render();
  showToast(`Loaded ${event.target.options[event.target.selectedIndex].text}.`);
});
$("zone-filter").addEventListener("change", render);
$("run-scan").addEventListener("click", () => {
  analysisCount++;
  $("last-updated").textContent = `Run ${analysisCount}`;
  render();
  showToast("Analysis complete. Zone status and priorities refreshed.");
});
$("export-csv").addEventListener("click", exportCSV);
$("show-all-alerts").addEventListener("click", () => setView("alerts"));
document.querySelectorAll(".nav-item").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));

$("last-updated").textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
setView("overview");
