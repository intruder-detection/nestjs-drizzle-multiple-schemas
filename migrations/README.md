# Migrations

For all commands inside this README that contain the `<SET_ENV_VARS>` property, they should use:

```bash
env DB_NAME="drizzle-orm" env DB_PASSWORD="pass" env DB_PORT="5432" env DB_SCHEMA_NAME="your-custom-schema-name" env DB_USER="drizzle-orm"
```

Remember to change the schema name (`DB_SCHEMA_NAME`) depending on your needs (as you should change any other property depending on your database setup).

---

## Generate new migration from the existing entities

```bash
<SET_ENV_VARS> drizzle-kit generate:pg   
```

## Run migrations against the database (using [migrate](https://orm.drizzle.team/kit-docs/overview#running-migrations))

```bash
<SET_ENV_VARS> node -r tsconfig-paths/register -r ts-node/register run_migrations.ts
```
---

## introspect (generate entities from existing database)

```bash
<SET_ENV_VARS> drizzle-kit introspect:pg
```



