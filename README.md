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
    * abstract.dao shows a way to have reusable Drizzle ORM queries for some actions that are performed for all actions
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

### Database

```bash
docker compose up
```

### API

```bash
npm run start
```

