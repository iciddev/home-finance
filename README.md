# Home Finance Management App

A simple web application to track your personal finances, including income and expenses.

## Features

- Add income and expense transactions
- View transaction history
- See financial summary (balance, total income, total expenses)
- Categorize transactions
- Responsive design

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

The backend will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: SQLite
- **UI**: Material-UI

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Add a new transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/summary` - Get financial summary
