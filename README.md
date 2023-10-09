# auction-app

## Prerequisite

- Docker Desktop
- Node 20.7.0

## Setup Database

1. Run the container `docker-compose up -d database`
1. Install node module `yarn -i`
1. Sync Db schema `yarn run migration:up`
1. Seeding data
    ```
        npx ts-node database/seeding/seed.ts users ./database/seeding/data/users.csv
        npx ts-node database/seeding/seed.ts auctions ./database/seeding/data/auctions.csv
        npx ts-node database/seeding/seed.ts bids ./database/seeding/data/bids.csv
    ```


## Managing Migration

- Create new migration file: `yarn run migration:create`
- Sync to lastest migration: `yarn run migration:up`


## Using mikroORM

- https://mikro-orm.io/docs/