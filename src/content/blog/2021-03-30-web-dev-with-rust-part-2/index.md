---
title: 'Part 2 - Persisting Data To Database'
description:
  Connect your Rust GraphQL server to PostgreSQL using tokio-postgres.
lastUpdatedOn: 2021-03-30
tags:
  - rust
  - graphql
  - postgresql
---

This is article is part of a series. They are:

- [Part 1 - Simple GraphQL Server with Juniper And Actix](../web-dev-with-rust-part-1)
- **Part 2 - Persisting Data To Database**

---

In the [previous blog post](../web-dev-with-rust-part-1), we showed how easy it
is to create a GraphQL server in Rust. In this post, we will hook it up to a
Postgres database. To do this we will use the `tokio-postgres` package. While it
is possible to use an ORM in Rust (the most popular choice being
[diesel](https://docs.rs/diesel/latest/diesel/)), that topic is very dense on
its own, and even in high level frameworks like Node.js,
[it is debatable if ORMs are always the best choice](https://blog.logrocket.com/node-js-orms-why-shouldnt-use/).

I am using version 0.7.5 of `tokio-postgres`, so that needs to be added to our
`Cargo.toml` dependencies. We’ll also add `tokio` itself.

```bash
tokio = "1.17.0"
tokio-postgres = "0.7.5"
```

## Why the tokio-postgres package instead of postgres

Since we are using Actix Web, which already runs on top of the Tokio async
framework, we can benefit from async postgres queries too. If the Tokio
ecosystem seems at all confusing, you can think of it as behaving similarly to
JavaScript’s cooperative multitasking event system. The
[Deno](https://deno.com/) JavaScript runtime uses Tokio for this very purpose.
The APIs between `tokio-postgres` and `postgres` are very similar, with the
former returning await-able `Future`s.

The `tokio-postgres` benefits from the Tokio runtime the same as most JavaScript
libraries benefit from its event queue. Multiple queries can happen
simultaneously without blocking the others and can be handled later thanks to
the `await` keyword.

## Setting up a Postgres server

I won’t be getting into installing Postgres as it depends entirely on your
operating system and environment, but for the uninitiated I highly recommend
using Docker if you simply need a database running on your local system. It’s
trivial to get Postgres running and everything is sandboxed so it can easily be
removed later. There is an example `docker-compose` configuration on the
[Docker Hub page](https://hub.docker.com/_/postgres) that will bring up postgres
and a companion adminer for debugging. The configuration needs to be modified so
that postgres exposes port 5432, similar to how adminer exposes port 8080.

Connecting is straightforward enough, use the `connect` method and await the
`connection`’s success in a separate thread. Even if you don’t plan on handling
anything about the connection’s success or failure, this thread is still
necessary. The `client` object allows us to submit queries to the database, and
we will handle it later.

```rust
use tokio_postgres::NoTls;

// ...

async fn main() -> io::Result<()> {
    let (client, connection) =
        tokio_postgres::connect("postgresql://username:password@localhost/database", NoTls).await.unwrap();
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("connection error: {}", e);
        }
    });
//...
```

## Creating the table

This step needs to only happen once. The database needs to contain a table for
our GraphQL data. Specifically, we wish to create the `person` table with a
unique id and two fields:

```rust
CREATE TABLE person (
    id      SERIAL PRIMARY KEY,
    name    TEXT NOT NULL,
    age     INTEGER NOT NULL
)
```

You can do this manually if you have some database tool, but it’s also possible
to do with our Postgres client (and perhaps a good opportunity to ensure things
are working correctly):

```rust
client.batch_execute("
    CREATE TABLE person (
        id      SERIAL PRIMARY KEY,
        name    TEXT NOT NULL,
        data    BYTEA
    )
").await.unwrap();
```

## The GraphQL Context

In order for the GraphQL queries and mutations to have what they need (in this
case, the database client), we must create a context object that is passed to
the GraphQL handler functions. Context objects are denoted with a trait,
`juniper::Context`, and are pretty straightforward:

```rust
use tokio_postgres::Client;

pub struct Context {
    pub db: Client,
}

impl juniper::Context for Context {}
```

Now we need to make some modifications to our schema. The Query, Mutation, and
Subscription root nodes all need to use this new `Context` object.

```rust
#[juniper::graphql_object(context = Context)]
impl QueryRoot {
    fn person<'c>(context: &'c Context, _id: i32) -> FieldResult<Person> {
        // ...
    }
}

pub type Schema = RootNode<'static, QueryRoot, EmptyMutation<Context>, EmptySubscription<Context>>;

pub fn create_schema() -> Schema {
    Schema::new(QueryRoot {}, EmptyMutation::<Context>::new(), EmptySubscription::<Context>::new())
}
```

Our `graphql` endpoint needs to use this `Context` as well:

```rust
#[route("/graphql", method = "GET", method = "POST")]
async fn graphql(schema: web::Data<Schema>, context: web::Data<Context>, request: web::Json<GraphQLRequest>) -> impl Responder {
    HttpResponse::Ok().json(request.execute(&schema, &context).await)
}
```

And finally, we must add it to our `App` definition as data, alongside the
existing schema. We use the `client` from the database connection above. The
data passed into `Data::from` must be clone-able and thread safe, so we wrap the
context into an atomic reference counter (`Arc`). The `clone` method for `Arc`
does not actually clone the underlying data, it simply increases the reference
counter and returns another handle for the data. The `App` builder looks as
follows:

```rust
let context = Arc::new(Context {
    db: client,
});

// ...

App::new()
    .app_data(Data::from(schema.clone()))
    .app_data(Data::from(context.clone()))
    .service(graphql)
    .service(graphql_playground)
    .wrap(Cors::permissive())
```

Moving forward, any other data that is required by GraphQL can simply be added
to the `Context` struct.

## Querying the Database

Now that GraphQL can access the database client, we can create a query to fetch
from our Postgres database. The `person` query can be modified to be an async
functions, and return an `Option<Person>` (as opposed to just `Person`).
Returning `None` allows us to tell GraphQL to return `null`, which is now
necessary since our database query could yield no results. Aside from that, the
code should be fairly straightforward.

```rust
#[juniper::graphql_object(context = Context)]
impl QueryRoot {
    async fn person<'c>(context: &'c Context, id: i32) -> FieldResult<Option<Person>> {
        let row = context.db
            .query_one("SELECT id, name, age FROM person WHERE id = $1", &[&id])
            .await;
        if let Ok(person) = row {
            let id: i32 = person.get(0);
            let name: &str = person.get(1);
            let age: i32 = person.get(2);
            Ok(Some(Person {
                id,
                name: name.to_owned(),
                age,
            }))
        } else {
            Ok(None)
        }
    }
```

One part of this code which may be peculiar to those less familiar with Rust is
the `get` function on the database row. It is necessary to convert the type from
something the database understands into something that Rust understands, and
this is done using type annotations. Rust’s type inference engine is very
powerful, and in this case it’s able to infer the type parameter of `get` based
on the type annotation, and does the proper conversion into that type using a
`FromSql` trait.

All of that is to say, Rust continues to make our life easy with some cleverly
designed language features.

## Database Mutation

Being able to query the database is all well and good, but unless you manually
enter some data into it, there is nothing to query. What we need is a GraphQL
mutation, allowing us to add a new `Person` object into the database.

The code ends up looking familiar, as it works similarly to our query. Mutations
are done in a separate `MutationRoot` struct which will replace our
`EmptyMutation` stub. Do note that while the function is named `create_person`
(following Rust naming conventions), the GraphQL mutation receives the name
`createPerson` (following GraphQL naming conventions).

```rust
pub struct MutationRoot;

#[juniper::graphql_object(context = Context)]
impl MutationRoot {
    async fn create_person<'c>(context: &'c Context, name: String, age: i32) -> FieldResult<Option<Person>> {
        let row = context.db
            .query_one(
              "INSERT INTO person (name, age) VALUES ($1, $2) RETURNING id, name, age",
              &[&name, &age],
            )
            .await;
        if let Ok(person) = row {
            let id: i32 = person.get(0);
            let name: &str = person.get(1);
            let age: i32 = person.get(2);
            Ok(Some(Person {
                id,
                name: name.to_owned(),
                age,
            }))
        } else {
            Ok(None)
        }
    }
}
```

The `create_schema` function needs to be modified to use this new struct:

```rust
pub fn create_schema() -> Schema {
    Schema::new(QueryRoot {}, MutationRoot {}, EmptySubscription::<Context>::new())
}
```

![GraphiQL Interface](graphiql.png 'GraphiQL Interface')

## Putting it all together

We have all the code available in a GitHub repository
[which can be found here](https://github.com/LaunchPathTech/graphql-in-rust).
