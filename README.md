# auction-app

## Prerequisite

- Docker Desktop
- Node 20.7.0

## Setup Database

1. Run the container `docker-compose up -d database`
2. Sync Db schema `yarn run migration:up`
3. Seeding data
    ```
        npx npx ts-node seeder/seed.ts user {{path_to_user_file}}.csv
        npx npx ts-node seeder/seed.ts auction {{path_to_to_auction_file}}.csv
        npx npx ts-node seeder/seed.ts bid {{path_to_bid_file}}.csv
    ```


## Managing Migration

- Create new migration file: `yarn run migration:create`
- Sync to lastest migration: `yarn run migration:up`
