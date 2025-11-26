---
title: 'Part 1 - Simple GraphQL Server with Juniper And Actix'
description:
  Build a simple GraphQL server in Rust using Juniper and Actix Web frameworks.
lastUpdatedOn: 2021-03-23
tags:
  - rust
  - graphql
  - actix
  - juniper
---

This is article is part of a series. They are:

- **Part 1 - Simple GraphQL Server with Juniper And Actix**
- [Part 2 - Persisting Data To Database](../web-dev-with-rust-part-2)

---

Rust is an upcoming programming language that is often regarded as a low-level
systems language, however it comes with language features that allow it to
extend itself into other domains while minimizing the boilerplate you might
expect from a systems language. We will be looking at Rust as a GraphQL Server
and demonstrating its simplicity when paired with powerful frameworks such as
Juniper and Actix Web. Comparisons will be made with Node.js and the Express
framework which has undoubtedly had an influence on the entire space.

Some prior knowledge of web frameworks, GraphQL, and the Rust programming
language are assumed in this article.

If you are looking for complete example code, I recommend looking at the
[GraphQL using Juniper Actix Example](https://github.com/actix/examples/tree/main/graphql/juniper).

## Why Rust?

If you are looking to get something up quick, Rust might not be your best bet.
Building a GraphQL backend in Rust will take some extra time, and you will spend
some of that time arguing with the language’s borrow checker and the compiler’s
insistence on correct, transparent code. Rust is a systems language without a
garbage collector, and has a proven model of ownership forcing its users to
write memory safe code, preventing notorious bugs such as buffer overflows. It
has all the same safety as writing your server in Node.js, but without the need
for a garbage collector or interpreter. Ideally, in the long term, you can have
more confidence in the correctness of your code when using Rust, and benefit in
a speed boost from the reduced overhead.

Not to mention, if your business does end up needing performance critical code
elsewhere, you can write everything in one programming language. That includes
in the web with Rust’s excellent out-of-the-box WASM support.

## Initial Setup

Create a folder with a name of your choosing, run `cargo init` in the folder to
bootstrap the project, and then open the Cargo.toml, adding the following
dependencies under the `[dependencies]` block:

```bash
actix-web = "4"
actix-cors = "0.6"
juniper = "0.15"
```

The `actix-web` and `juniper` are the primary points of discussion in this
article. `actix-cors` is middleware which should be very familiar to anyone
coming from Node.js and Express-like frameworks. It is middleware which adds
CORS headers to the HTTP responses.

## Creating The App with Actix Web

I will let the code do the talking here.

```rust
use std::io;
use actix_web::{ App, HttpServer };

#[actix_web::main]
async fn main() -> io::Result<()> {
    HttpServer::new(move || {
        App::new()
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

(Note: If you run this code, you will receive a 404 error since it’s not serving
any content)

As you can see, it’s not quite as small as an equivalent Express app, but
compared to web frameworks in C/C++ from years past, humble systems languages
have come a long way. The `actix_web::main` macro is handling a lot of the busy
work for you, and the interface of the API has the same simplicity you’d expect
from high level frameworks.

To understand better what the `actix_web::main` macro is providing, it is
helpful to read the [Async in Depth](https://tokio.rs/tokio/tutorial/async)
article by the Tokio team. Actix Web uses Tokio as its asynchronous runtime and
the main macro here is more or less the same as Tokio’s provided `tokio::main`.

### The CORS Middleware

It wouldn’t be a modern web framework without middleware. Middleware are plugins
that can act on all requests and responses to further cut down on the
boilerplate. A common middleware is the CORS header, which adds special headers
to each response allowing for cross-origin requests in web browsers.

Rust libraries often use the builder pattern to construct configuration objects
and we also see it here with the Actix Web `App`. Middleware is added to our web
app using `wrap`.

```rust
use actix_cors::Cors;

// ...

App::new().wrap(Cors::permissive())
```

CORS header may not be necessary in all applications, but we will add them to
ensure the GraphiQL debug tool we add later works properly.

### Adding Routes

Admittedly, this has all been pretty straightforward stuff so far. Hiding away
the work of handling HTTP packets and registering plugins shouldn’t be
complicated. The real power starts to show when it comes to introducing
application specific logic, like routes. We need to handle the actual contents
of those incoming HTTP headers, which is not only tedious, but also error-prone.
The route handling obviously needs to be abstracted away, which tends to add a
lot of complexity and even more boilerplate. However, we can solve this problem
using Rust macros:

```rust
use actix_web::get;

// ...

#[get("/hello")]
async fn hello() -> &'static str {
    "Hello World"
}
```

Add our route using the same `App` builder:

```rust
use actix_cors::Cors;

// ...

App::new().service(hello)
```

There is a lot happening here. The `get` macro wraps `hello`, handling all the
routing for you, and only invoking the function if the route is `/hello`. That’s
not all, however. Notice that we are returning a static lifetime `&str`. This
isn’t very expandable as most strings probably don’t have a static lifetime.
Actix Web routes (or “services”) can return anything that implements
`Responder`. Many types, such as string types, are coalesced into this trait.
With `Responder`, you can also provide response headers. Finally, the whole
function is marked `async`, which is not too dissimilar from the equivalent in
JavaScript.

The point here isn’t necessarily to explain every little detail about how Actix
Web works (for that you can check their docs), it is to show just how much
boilerplate is swept under the rug.

## Adding GraphQL with Juniper

The process of adding Juniper to Actix Web is fairly straightforward, but the
first thing we need is a schema definition for GraphQL. Once we have that, we
will add a route for `/graphql`. Finally, we will add in the provided GraphiQL
web interface to interact with the GraphQL API.

### Creating the Schema

GraphQL brings a lot of its own perks to the table. It has built-in schema
checking, its own query language, and lots of documentation features all built
in. The only thing needed to integrate GraphQL with a programming language is a
bit of mapping, and here’s where macros come to the rescue yet again.

To define a GraphQL object, we derive `GraphQLObject` and create a Rust struct
as usual. We can provide a description for this object as well. You can use the
usual GraphQL primitives (with `i32` being `Int` and `f32` being `Float`), as
well as other GraphQL objects. `Vec` can be used for arrays.

```rust
use juniper::GraphQLObject;

#[derive(GraphQLObject)]
#[graphql(description = "A person")]
struct Person {
    name: String,
    age: f64,
}
```

To query for this type, we must define query functions. Again, we rely on
macros, and these can infer a lot about the implementation within. The functions
need to return `FieldResult` to allow for error checking, and the `_id`
parameter here is to demonstrate how to add Query parameters, but is currently
unused.

```rust
use juniper::FieldResult;

pub struct QueryRoot;

#[juniper::graphql_object]
impl QueryRoot {
    // This is the person() GraphQL query
    fn person(_id: i32) -> FieldResult<Person> {
        Ok(Person {
            name: "Bob".to_string(),
            age: 42.0,
        })
    }
}
```

From there we simply need to create a schema, the simplest of which looks
something like this:

```rust
use juniper::{EmptyMutation, EmptySubscription, RootNode};

pub type Schema = RootNode<'static, QueryRoot, EmptyMutation, EmptySubscription>;

pub fn create_schema() -> Schema {
    Schema::new(QueryRoot {}, EmptyMutation::new(), EmptySubscription::new())
}
```

Adding a mutation looks almost identical to `QueryRoot` and goes inside the
second parameter of `Schema::new`. For subscriptions, it’s more complicated, and
I suggest checking out the juniper docs.

### Plugging it into Actix Web (+ GraphiQL Playground)

The only thing necessary is to add a `/graphql` route and execute the
`GraphQLRequest` with the `Schema`. The code is surprisingly clean and
straightforward.

```rust
use std::{io, sync::Arc};
use actix_web::{ get, route, web::{self, Data}, App, HttpResponse, HttpServer, Responder };
use actix_cors::Cors;
use juniper::http::{graphiql::graphiql_source, GraphQLRequest};
use crate::schema::{create_schema, Schema};

mod schema;

#[get("/graphiql")]
async fn graphql_playground() -> impl Responder {
    HttpResponse::Ok().body(graphiql_source("/graphql", None))
}

#[route("/graphql", method = "GET", method = "POST")]
async fn graphql(schema: web::Data<Schema>, request: web::Json<GraphQLRequest>) -> impl Responder {
    HttpResponse::Ok().json(request.execute(&schema, &()).await)
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    let schema = Arc::new(create_schema());
    HttpServer::new(move || {
        App::new()
            .app_data(Data::from(schema.clone()))
            .service(graphql)
            .service(graphql_playground)
            .wrap(Cors::permissive())
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

There is a bit of trickery here in the `graphql` function. It’s able to grab the
`Schema` and `GraphQLRequest` automatically by declaring them as parameters. You
do also need the `add_data`, which makes the data accessible from within
services by TypeId.

<!-- markdown-link-check-disable-next-line -->

You can see the whole thing in action by running the app and navigating to
http://localhost:8080/graphiql

![GraphiQL Interface](graphiql.png 'GraphiQL Interface')

## Putting it All Together

This was a look at the simplicity of creating a GraphQL server in Rust, but the
ecosystem is still relatively new and APIs can change. Check out the
[GraphQL using Juniper Actix Example](https://github.com/actix/examples/tree/main/graphql/juniper).

To see how to hook up Juniper with a Postgres database,
[click here for part 2](../web-dev-with-rust-part-2).
