## Running locally

### Requirements

- NPM 6+, Node 12+
- PostgreSQL 12+

### Install

#### Server

From the root directory:
```
cp .env_example .env
```

From the `server` directory:
```
# Set up database
psql -c "CREATE DATABASE toc_tracker"
psql crunchspace < ./migrations/010--create-table-high-score.sql
psql crunchspace < ./migrations/020--create-table-score.sql

# Install dependencies
npm install
```

#### Client

TODO

### Run

TODO

## Deploying to Heroku
Prerequisites: Heroku CLI

```
heroku create
git push heroku main
heroku addons:create heroku-postgresql:hobby-dev

# Run migrations
heroku pg:psql < server/migrations/010--create-table-high-score.sql
heroku pg:psql < server/migrations/020--create-table-score.sql

# OR run migrations like this instead
psql $(heroku config:get DATABASE_URL) < server/migrations/010--create-table-high-score.sql
psql $(heroku config:get DATABASE_URL) < server/migrations/020--create-table-score.sql
```
