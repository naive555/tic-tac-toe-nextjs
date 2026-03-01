# Tic-Tac-Toe Frontend (Next.js)

Frontend application for the Tic-Tac-Toe game built with Next.js (App Router).  
This client handles authentication, gameplay UI, leaderboard display, and communication with backend API.

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- Auth0 (OAuth login)
- Fetch API (backend communication)
- Tailwind CSS (if applicable)

---

## Features

- OAuth login via Auth0
- Play Tic-Tac-Toe against bot
- Real-time score updates
- Leaderboard view
- Result banner (WIN / LOSE / DRAW)
- Reset board functionality

---

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
NODE_ENV=local

APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000

AUTH0_SECRET=your_secret
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
```

Make sure backend is running before starting frontend.

### 3. Run development server

```bash
bun run dev
```

Open:

```
http://localhost:3000
```

---

## Project Structure

```
app/
  api/              # API handlers
  game/             # Main game page
  leaderboard/      # Leaderboard page
  profile/          # Profile page
  page.tsx          # Authentication page
components/
  Board.tsx
  ScoreBoard.tsx
lib/
  api.ts            # API wrapper
```

---

## Game Flow

1. User logs in via Auth0
2. Player clicks a cell
3. Frontend sends:
   ```
   POST /api/game/play
   ```
4. Backend returns:
   ```
   { board, result }
   ```
5. If game finished:
   - Score is updated server-side
   - UI shows result banner
6. Player can reset board to play again

---

## Production Build

```bash
bun run build
bun run start
```

---

## Deployment

Recommended: Deploy on Vercel.

Steps:

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

Make sure backend API URL is updated in production environment variables.

---

## Notes

- Board state is controlled via React state.
- Score and leaderboard are always fetched from backend.
- Game logic is server-authoritative (prevents client-side cheating).
- UI disables board during request to prevent double submission.

---

## Backend Requirement

This frontend requires the backend running with:

- `/api/game/play`
- `/api/scores/me`
- `/api/scores`

---

## License

MIT
