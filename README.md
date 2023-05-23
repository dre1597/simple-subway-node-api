# simple-subway-node-api

## Description

Simple api to practice some MySQL (triggers, procedures, views, etc.), tests, architecture and check out some
technologies
like [Pnpm](https://pnpm.io), [Fastify](https://fastify.io), [Pactum](https://pactumjs.github.io), [Yup](https://github.com/jquense/yup)
and
more.

## Technologies

### Environment, language and database

- [Node](https://nodejs.org)
- [Typescript](https://www.typescriptlang.org)
- [MySQL](https://www.mysql.com)

### Frameworks

- [Fastify](https://fastify.io)

### Linters and formatters

- [Eslint](https://eslint.org)
- [Prettier](https://prettier.io)

### Test tools

- [Vitest](https://vitest.dev)
- [Pactum](https://pactumjs.github.io)

### Other tools

- [Pnpm](https://pnpm.io)
- [Husky](https://github.com/typicode/husky)
- [Lint Staged](https://github.com/okonet/lint-staged)
- [Yup](https://github.com/jquense/yup)

## Instalation

```bash
npm i -g pnpm

pnpm install
```

> If you want to use YARN or NPM remember to remove `pnpm-lock.yaml` and use `yarn install` or `npm install` instead.

## Environment Configuration

> Create the database MYSQL with the production database and test database.

> Create a `.env` file with the content of the `.env.example` file. Remember to change the database names if you are
> using other databases.

> Execute the migrations on the databases. (Migrations are executed by default when you run the application too, but not
> the tests)

```bash
npm run migration:run

npm run migration:run:test
```

## Husky and lint staged Configuration

```bash
npm run prepare
```

> If you are on linux (and maybe MacOS) remember to give the execution permission to husky scripts

```bash
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Running the application

```bash
pnpm start:dev
```

## Running the tests

```bash
pnpm test
```

### with coverage

```bash
pnpm test:coverage
```

> Check out `package.json` for more options.
