# auction-app

## Prerequisite

- Docker Desktop
- Node 20.7.0

## Backend & DB

### database

- Database: Postgresql
- ORM: [MikroOrm](https://mikro-orm.io/docs/)

### Setup

1. Go to the right folder `cd auction-backend`
1. Run the DB container `docker-compose up -d database`
1. Install node module `yarn install`
1. Sync Db schema `yarn run migration:up`
1. Seeding data
    ```
        npx ts-node database/seeding/seed.ts users ./database/seeding/data/users.csv
        npx ts-node database/seeding/seed.ts auctions ./database/seeding/data/auctions.csv
        npx ts-node database/seeding/seed.ts bids ./database/seeding/data/bids.csv
    ```

### Running backend
- `yarn run dev`

### Managing Migration
- Made any change in the Db's entities? To deploy them on the DB do:
    1. Create new migration file: `yarn run migration:create`
    1. Sync DB to lastest migration: `yarn run migration:up`


## Frontend

### Setup
- `yarn install`


### Run the app (in the development mode)

- `yarn start`

> Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


### Other commands 

-  `yarn test` => Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

-  `yarn build` => Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
