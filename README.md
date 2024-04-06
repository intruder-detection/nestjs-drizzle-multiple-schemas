# NestJS with Drizzle ORM

This is an example/starter using the following stack
* [NestJS](https://docs.nestjs.com/)
  * [Fastity](https://docs.nestjs.com/security/helmet#use-with-fastify)
  * Custom logger ([pino](https://github.com/pinojs/pino) with [pino-pretty](https://github.com/pinojs/pino-pretty))
    * Custom logger with possibility to add request id to the logs
  * Using [Configuration](https://docs.nestjs.com/techniques/configuration)
* [Drizzle ORM](https://orm.drizzle.team/docs/overview)
  * Multiple schemas
  * Custom logger (with interpolated queries)
  * Example with reusable DAO
    * abstract.dao shows a way to have reusable Drizzle ORM queries for some actions
      * getAll
      * getById (UUID)
      * getBySingleKey
* [PostgresSQL](https://www.postgresql.org/)

It's an attempt (simple and concise) to show how to create **multiple schemas** using **Drizzle ORM**. Currently, Drizzle doesn't provide an easy way to do so.

> Why do we want multiple schemas?

Sometimes for **testing purposes** we want to have the following schemas

* `test1` - Schema for test1
* `test2` - Schema for test2
* ...
* `testN` - Schema for testN

This way, we can run each test against a specific schema, so that, the tests are contained.

This might also be useful for a **multi-tenant** approach.

---

## Install

```
npm i
```

#  Run

## [Quick Start Database and initial migration](./migrations/README.md#quick-start)

### API

```bash
env DB_USER="drizzle-orm" env DB_PASSWORD="pass" env DB_HOST_NAME="localhost" env DB_PORT="5432" env DB_NAME="drizzle-orm" env DB_SCHEMA_NAME="schema_1" npm run start
```

Afterwards, open the following URL http://localhost:7979/api/jobs

---

### Migrations

To have a better understanding about how migrations are set up, please see [migrations README](./migrations/README.md)
