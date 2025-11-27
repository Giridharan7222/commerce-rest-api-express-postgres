# PostgreSQL Database with Flyway Migrations

## Quick Start

```bash
# Start database and run migrations
./env/local/_up.sh

# Stop services
./env/local/_down.sh
```

## Database Access

### PostgreSQL
- **Host**: localhost:5433
- **User**: dbuser
- **Database**: mydb
- **Password**: dbpass123

## Migration Files
- **Schema**: `migrations/schema/V{version}__{description}.sql`
- **Seeders**: `migrations/seeder/V{version}__{description}.sql`
- **Views**: `migrations/views/R__{description}.sql`

## Services
- **PostgreSQL**: PostGIS-enabled database (port 5433)
- **Flyway**: Automatic migration runner

## PostgreSQL Management

**Connect via psql:**
```bash
psql -h localhost -p 5433 -U dbuser -d mydb
```

**GUI Tools:**
- **pgAdmin**: Official PostgreSQL administration tool
- **DBeaver**: Free universal database tool
- **DataGrip**: JetBrains database IDE