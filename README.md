# Home Finance Management App

A modern web application to track your personal finances, including income and expenses.

## Features

- Add, edit, and delete income and expense transactions
- View transaction history
- See financial summary (balance, total income, total expenses)
- Categorize transactions
- Interactive charts by category
- Responsive, minimal, and colorful UI inspired by Evo Banco
- Modern design system: Material UI (MUI) with Montserrat font

## Setup

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run dev  # for development with auto-reload
   # or
   npm start    # for production
   ```

The backend will be available at `http://localhost:5000` (or your configured port).

#### Exposing Backend for Frontend (Cloudflare Tunnel)
For local development with a remote frontend (e.g., Netlify), expose your backend using Cloudflare Tunnel:
```bash
cloudflared tunnel --url http://localhost:5000
```
- This gives you a public URL (e.g., `https://random-string.trycloudflare.com`).
- For persistent tunnels, see [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/).

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   REACT_APP_API_URL=<your-backend-url>/api
   ```
   - For local dev, use `http://localhost:5000/api`.
   - For remote/Netlify, use your Cloudflare Tunnel URL.
4. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`.

### Deployment (Netlify)

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `client/build` directory to Netlify.
   - **Publish directory:** `client/build`
   - Make sure `public/_redirects` contains:
     ```
     /*    /index.html   200
     ```

### Modern UI & Design
- Uses Material UI (MUI v5) with custom theme and Montserrat font ([Google Fonts](https://fonts.google.com/specimen/Montserrat)).
- Evo Banco-inspired: white backgrounds, solid green accents (#388e3c), bold headings, lots of whitespace.
- Fully responsive and accessible.

## Tech Stack

- **Frontend:** React.js, Material-UI (MUI), Recharts
- **Backend:** Node.js with Express
- **Database:** SQLite
- **Deployment:** Netlify (frontend), Cloudflare Tunnel (backend for dev)

## License

MIT

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add a new transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/summary` - Get financial summary
# home-finance
