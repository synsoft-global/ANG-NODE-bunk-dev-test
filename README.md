# ANG-NODE-bunk-dev-test(Holiday Expenses Calculator)

## Overview

A Holiday Expenses Calculator is a shared list of transactions which lets you and your friends balance your joint expenditure, such as during a shared activity, on a holiday or in a house share.
Follow the best practices and high development standards for a top-notch project.

## Challenge

The Bunk team are all going on a work holiday but they need an app to keep a track of expenses and who owes money to who at the end of the trip.

## Technologies Used

- TypeScript preferably, (JavaScript if not familiar with TypeScript)
- Angular 15+
- Node 16+ + Web Framework, i.e. Express
- Backend tests (ideally with Jest)
- E2E tests (ideally with Cypress)
- Git + Github for version control

## Library Used

- [Node js][https://nodejs.org/en/blog/release/v20.10.0]
- [Typescript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)

## Features & Functionality in the Project:

- Package Management with Yarn
- Testing with Jest and Supertest
- Secured HTTP Headers using helmet
- Logging with Winston
- Environment Variables using dotenv
- Compression with gzip
- Git Hooks with husky and lint-staged
- Linting and Enforced Code Style using ESLint and Prettier

## Getting started

To get started with this project, follow these steps:

1. Clone repository:

```bash
git https://github.com/synsoft-global/ANG-NODE-bunk-dev-test.git
```

# then change directory cd api

2. Install dependencies:

```bash
 npm install --global yarn
```

```bash
  yarn install
```

# if get error - **_Git hooks_** with husky and lint-staged

use yarn add husky

```bash
 yarn add husky || yarn  husky
```

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file(change .env.example name to .env)

`NODE_ENV`

`PORT`

`CORS_ORIGIN`

See .env.example for further details

<!-- Run Locally -->

### Run Locally

Start the server in development mode

```bash
  yarn watch
```

```bash
  yarn dev
```

<!-- Run production  -->

Start the server in production mode

```bash
  yarn build
```

```bash
  yarn start
```

For insert data into country and category tables

```bash
  yarn syncdb
```

<!-- Running Tests -->

### Running Tests

To run tests, run the following command

```bash
  yarn test
```

### Linting

```bash
  # run ESLint
  yarn lint

  # fix ESLint errors
  yarn lint:fix

  # run prettier
  yarn code:check

  # fix prettier errors
  yarn code:format

  # fix prettier errors in specific file
  yarn code:format:specific-file <file-name>
```

## Getting started for frontend

To get started with this project, follow these steps:

1.  then change directory cd web

2.  Install dependencies:
    npm install

3.  Run Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
