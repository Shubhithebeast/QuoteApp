# QuoteApp

QuoteApp is a MERN project for browsing and searching motivational quotes.

## Local Setup

1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

2. Configure backend env in `server/.env`

```env
MONGO_URI=your_mongodb_connection_string
PORT=5001
```

3. Configure frontend env in `client/.env`

```env
PORT=3001
REACT_APP_API_URL=http://localhost:5001
```

4. Start backend

```bash
cd server
npm run start
```

5. Start frontend

```bash
cd client
npm start
```

App runs at `http://localhost:3001`.

## Available Backend Scripts

- `npm run start` - start API
- `npm run dev` - start API with nodemon
- `npm run import` - import quotes from `server/quotes.json` into MongoDB

## API Endpoints

- `GET /health` - health check
- `GET /api/random` - random quote
- `GET /api/search/:author` - random quote by matching author
- `GET /api/stats` - total quotes and authors
