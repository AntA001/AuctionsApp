# auction-app

## Prerequisite

- Docker Desktop
- Node 20.7.0

## Setup Database

1. Run the container `docker-compose up -d database`
2. Sync Db schema `yarn run migration:up`


## Managing Migration

- Create new migration file: `yarn run migration:create`
- Sync to lastest migration: `yarn run migration:up`
