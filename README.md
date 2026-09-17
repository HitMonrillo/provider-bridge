# Care Coordination Tracker

A demo app to track outreach requests between healthcare providers and auto-escalate unanswered requests.

**Backstory:** When scheduling physiotherapy after surgery, a US clinic couldn't reach my surgeon in Brazil—the request just went silent. This tool tracks provider-to-provider requests and flags escalations when nobody responds within 48 hours.

## Stack

- **Backend:** C# / ASP.NET Core 8, Entity Framework Core, SQLite
- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS
- **Demo features:**
  - Bilingual (EN/PT) auto-generated request summaries
  - Background job that flags requests as "overdue" after 48 hours (no real waiting—trigger it manually for demo)
  - Auto-drafted follow-up messages in alternate channels
  - Dashboard to view requests, mark them resolved, and trigger demo actions

## Project Structure

```
epicsystemsproject/
├── backend/          # ASP.NET Core Web API
│   ├── Models/
│   ├── Data/
│   ├── Controllers/
│   ├── Services/
│   ├── DTOs/
│   ├── Program.cs
│   └── CareCoordinator.csproj
└── frontend/         # React + TypeScript
    ├── src/
    ├── public/
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## Quick Start

### Backend

```bash
cd backend
dotnet restore
dotnet ef database update  # Creates SQLite database & schema
dotnet run                  # Starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev               # Starts on http://localhost:5173
```

Then open `http://localhost:5173` in your browser.

## Demo Flow

1. **Create a Request:** Fill in the form (Patient, Provider, what's needed). Auto-generates bilingual summary, logs first outreach.
2. **Simulate No Response:** Request is "sent" but no response received.
3. **Trigger Overdue Check:** Click "Check for Overdue" button on dashboard (simulates the background job running).
4. **See Escalation:** Request is flagged "overdue", auto-drafted follow-up appears in a second channel (OutreachAttempt log).
5. **Mark Resolved:** Once response received, mark request as resolved.

## API Endpoints

- `GET /api/patients`
- `POST /api/patients`
- `GET /api/providers`
- `POST /api/providers`
- `GET /api/requests`
- `POST /api/requests`
- `PATCH /api/requests/{id}/status`
- `GET /api/requests/{id}/outreach-attempts`
- `POST /api/requests/check-overdue` (trigger escalation check)

## Notes

- All outreach (email, WhatsApp, fax) is **mocked**—no real messages sent.
- SQLite database lives at `backend/carecoordinator.db`.
- Background job runs as a HostedService polling every 30 seconds in demo mode.
- Bilingual templates are hardcoded for MVP; can be moved to a database later.
