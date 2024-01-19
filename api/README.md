# ANG-NODE-bunk-dev-test(tricount)

## Overview
 A tricount is a shared list of transactions which lets you and your friends balance your joint expenditure, such as during a shared activity, on a holiday or in a house share.
 Follow the best practices and high development standards for a top-notch project.


 ## Library Used
 - [Node js][https://nodejs.org/en/blog/release/v20.10.0]
-  [Typescript](https://www.typescriptlang.org/)
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
 # then change directory  cd api

2. Install dependencies:

```bash
 npm install --global yarn
```

```bash
  yarn install
```
# if get error - ***Git hooks*** with husky and lint-staged

 use yarn add husky
 ```bash
  yarn add husky || yarn  husky
```
### Environment Variables

To run this project, you will need to add the following environment variables to your .env file(change .env.example name  to .env)
 
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

