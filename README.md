# Drizzle ORM in NestJS

This is an example/starter using the following stack
* NestJS
* Drizzle ORM

It attempts to show how to create multiple schemas using the same codebase. Drizzle ORM currently doesn't provide an easy way to do so, and as a result, this is an attempt to make it simple and concise.

Sometimes for testing purposes we want to have the following schemas

* test1
* test2 
* ...
* testN

This way, we can run each test against a specific schema, so that, the tests are contained.

This might also be useful for a multi-tenant approach. 

---

You can also find some NesJS goodies in the project

* Custom logging with pino pretty
* abstract.dao shows a way to have reusable Drizzle ORM queries for some actions that are performed for all actions
  * getAll
  * getById (UUID)
  * getBySingleKey
