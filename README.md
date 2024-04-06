# NestJS with Drizzle ORM

This is an example/starter using the following stack
* `NestJS`
  * `Fastity`
  * Custom logger (`pino` with `pino-pretty`)
    * Custom logger with possibility to add request id to the logs
  * Using Configuration
* `Drizzle ORM`
  * Multiple schemas
  * Custom logger (with interpolated queries)
* `PostgresSQL`

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

You can also find some NesJS goodies in the project

* Custom logging with pino pretty
* abstract.dao shows a way to have reusable Drizzle ORM queries for some actions that are performed for all actions
  * getAll
  * getById (UUID)
  * getBySingleKey

## Install

```
npm i
```

#  Run 

### Database

```bash
docker compose up
```

### API

```bash
npm run start
```

