# Environment Configuration

This directory contains environment configuration files for the Commerce API.

## Files

- `.env` - Main environment configuration file
- `.env.example` - Template file with example values (if exists)

## Configuration Variables

### Database
- `POSTGRES_HOST_NONCONTAINER` - Database host (localhost for local dev)
- `POSTGRES_PORT_NONCONTAINER` - Database port (5433)
- `POSTGRES_USER` - Database username
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name

### Server
- `NODE_ENV` - Environment (development/production)
- `PORT` - API server port (5005)
- `API_BASE_URL` - Base URL for API

### Authentication
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time (24h)

### Payment Processing
- `STRIPE_SECRET_KEY` - Stripe secret key for payments
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

### File Upload
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Security & Performance
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window (15 minutes)
- `RATE_LIMIT_MAX` - Max requests per window (100)
- `ALLOWED_ORIGINS` - CORS allowed origins

### External Services
- `AWS_REGION` - AWS region for S3
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `IPINFO_TOKEN` - IP geolocation service token

## Setup

1. Ensure `.env` file exists in this directory
2. Update values according to your environment
3. Never commit sensitive values to version control
4. Use `.env.example` for sharing configuration templates

## Security Notes

- Keep `.env` file secure and never share publicly
- Use strong, unique values for JWT_SECRET
- Rotate secrets regularly in production
- Use environment-specific values for different deployments

## Usage

The application automatically loads these environment variables on startup using the configuration system in `../app.ts`.