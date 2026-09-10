# Disaster — Disaster Intelligence & Relocation Decision Support

Disaster is a prototype AI/GIS decision-support platform for identifying multi-hazard risk screening zones, assessing safer relocation sites, and prioritising vulnerable habitations in India.

> Important: this is an educational prototype. Red-zone shapes are risk-screening buffers, not official hazard boundaries. Every field action requires authorised SDMA/NDMA validation.

## What it demonstrates

- Interactive India GIS map with habitation markers, safe shelters, and high/critical-risk screening buffers.
- Explainable habitation risk assessment using hazard exposure, vulnerability, population exposure, and accessibility.
- Relocation priority queue that combines risk, safe-capacity deficit, and access constraints.
- Safer-site recommendation that ranks only active sites with available capacity, prioritises the same district, and explicitly flags an allocation gap when a shelter cannot accommodate everyone.
- Role-based national and district command views.

## Run locally (Windows / PowerShell)

Open two terminals in the project folder:

```powershell
cd D:\Dementors-main\Dementors-main
```

### 1. Start the FastAPI backend

Requires Python 3.11 or later.

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
uvicorn backend.main:app --reload --port 8000
```

If PowerShell prevents activation, run this once in that terminal, then activate again:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Backend API documentation: http://127.0.0.1:8000/docs

### 2. Start the React frontend

Requires Node.js 18 or later.

```powershell
npm install
npm run dev
```

Open the address printed by Vite (normally http://localhost:5173). The Vite proxy sends `/api` requests to FastAPI on port 8000.

### Production frontend check

```powershell
npm run build
```

## Demo flow

1. Open **Risk Intelligence Map** and inspect the red/orange screening buffers.
2. Select a habitation marker to display its evacuation route; shelters with sufficient capacity are preferred.
3. Open **Immediate Relocation Priority** and select **Find Safe Shelter**.
4. Review the weighted site score, capacity, distance, access, suitability, and **Full allocation / Gap** status.
5. Treat the result as a recommendation for an authorised officer—not an automatic relocation order.

## Data limitations and next integration step

The included incidents and sites are demo data; the weather endpoint can query Open-Meteo when the network is available. For deployment, connect validated feeds from IMD, CWC, NDMA/SACHET, GSI, and ISRO/Bhuvan, store layers in PostGIS, and retain officer approvals in an audit trail.
