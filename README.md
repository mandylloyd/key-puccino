# ☕ Key-Puccino

A role-based auth demo built with React, React Router, Keycloak, and Docker. Simulates a café workflow to show real-world RBAC and route protection in a frontend app.

---

## How it works

The user performs as the guest ordering a drink, the barista making it, and the manager checking quality and accuracy!

```
Guest → picks and submits a drink order
  ↓ logs out, barista logs in
Barista → plays a mini game simulating pouring the drink by ingredient
  ↓ logs out, manager logs in
Manager → sees the scored result on a leaderboard
```

Since there's no backend the order data and scores are saved in `localStorage` in case states get lost during role switching.

---

## Screenshots

[!NOTE]
 ⚠️ No judging the lack of styling here as that moment has not arrived (and it may never)

### Keycloak — Realm roles
![Realm roles](./screenshots/keycloak-roles.png)

### Keycloak login page
![Login](./screenshots/keycloak-login.png)

### Guest — drink selection
![Guest menu](./screenshots/guest-menu.png)

### Barista — mid pour
![Barista mid pour](./screenshots/barista-mid-pour.png)

### Barista — order complete
![Barista complete](./screenshots/barista-complete.png)

### Manager — leaderboard
![Leaderboard](./screenshots/leaderboard.png)

---

## Auth flow

```mermaid
flowchart TD
    A[User hits a route] --> B[ProtectedRoute checks Keycloak instance]
    B --> C{Authenticated?}
    C -- No --> D[Redirect to Keycloak login page]
    D --> E[User enters credentials]
    E --> F[Keycloak issues JWT with role claims]
    F --> B
    C -- Yes --> G{Has correct role?}
    G -- No --> H[Show Unauthorized]
    G -- Yes --> I[Render the page]

    I --> J{Which role?}
    J -- Guest --> K[/menu — pick a drink, submit order/]
    J -- Barista --> L[/barista — pour the drink mini game/]
    J -- Manager --> M[/manager — view leaderboard/]

    K --> N[Order saved to localStorage]
    N --> O[Guest logs out → Barista logs in]
    O --> L
    L --> P[Score saved to localStorage]
    P --> Q[Barista logs out → Manager logs in]
    Q --> M
```

---

## Stack

- React + React Router
- Keycloak (`@react-keycloak/web`)
- Docker

---

## Setup

**1. Start Keycloak with the realm config:**
```bash
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  -v /path/to/keycloak-export.json:/opt/keycloak/data/import/realm.json \
  quay.io/keycloak/keycloak:24.0.1 start-dev --import-realm
```

**2. Start the React app:**
```bash
cd coffee-shop
npm run dev
```

Then go to `http://localhost:5173/menu` and log in as a guest to start!

---

## Notes

- Leaderboard is localStorage only
- To add more players, create new Keycloak users and assign the appropriate role
- No styling beyond inline AT THIS TIME — this is an auth demo, not a UI demo.

---