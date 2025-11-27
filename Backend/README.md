# Giri Backend API

A Node.js/TypeScript API with PostgreSQL database integration.

## Project Structure

```
Backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── database/        # Database connection
│   ├── dtos/           # Data transfer objects
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── tests/          # Test files
│   ├── validators/     # Input validation
│   └── server.ts       # Application entry point
├── dist/               # Build output
├── package.json
├── tsconfig.json
└── README.md
```

## Scripts

- `yarn dev` - Start development server with hot reload
- `yarn start` - Start production server
- `yarn build` - Build TypeScript to JavaScript
- `yarn test` - Run test suite
- `yarn format` - Format code with Prettier
- `yarn format:check` - Check code formatting
- `yarn db:start` - Start database services
- `yarn db:stop` - Stop database services

## Development

1. Start database: `yarn db:start`
2. Start API: `yarn dev`
3. API runs on: http://localhost:5005

## API Endpoints

- `POST /api/users` - Create new user
- `GET /health` - Health check

## Testing

```bash
# Run all tests
yarn test

# Format code
yarn format
```
