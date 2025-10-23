---
title: Typed-GraphQL Performance Optimization
description: Eliminate N+1 Database Queries in Typed-GraphQL with Data Loader.
date: 2021-10-01
hero: ./featured-image.png
categories:
  - backend
tags:
  - graphql
  - typescript
  - optimization
---

While working on a project for a client, we came across an interesting twist to
a common problem. We were tasked with making the API backend that powers a
mobile app called [Playhouse](https://www.playhouse.so/), a mobile app that
displays real estate listings to its users in a nice little video package. We
decided to make a [GraphQL](https://graphql.org/) API and got to building.
During the design process, we made a point of keeping it maintainable for the
long run.

## Application Architecture

This backend is a [Node.js](https://nodejs.org/en/) application with a
[PostgreSQL](https://www.postgresql.org/) database. Since we were also using
[TypeScript](https://www.typescriptlang.org/), we decided to use
[TypeGraphQL](https://typegraphql.com/) to handle our GraphQL needs. Finally,
one of the steps we took to improve maintainability was to use the dependency
injection design pattern with the help of
[TypeDI](https://github.com/typestack/typedi).

## The N+1 Problem

Those who have worked will GraphQL will likely be familiar with this problem
already. When implementing a resolver for an object, if you just hit the
database as soon as the resolver is called, you'll end up querying the database
more than neccesary - sometimes a _lot_ more than necessary.

Let's take a look at an example. In our API, we have listings, comments, and
users. A listing can have multiple comments, and the comments are authored by
users. When looking up a listing, its comments, and the comments' authors, the
GraphQL query would look something like this:

```graphql
query {
  listing(id: 123) {
    id
    # ... a bunch of other fields
    comments {
      id
      body
      author {
        id
        username
      }
    }
  }
}
```

Let's take a look at what would happen if your comment's author resolver is
written naively and looks up the user immediately.

```typescript
@Resolver(() => Comment)
export class CommentResolver {
  // ... other resolvers

  @FieldResolver(() => User)
  async author(@Root() { authorId }: Comment): Promise<User> {
    const user = await db('users').where({ id: authorId })[0]
    return toSchema(user, User)
  }
}
```

In our application, we have a debug mode that outputs all the SQL queries that
were used for every query that was run. This is what it outputs:

```typescript
{
  bindings: [ 123 ],
  sql: 'select * from "listings" where "id" = ?'
}
{
  bindings: [ 123 ],
  sql: 'select * from "comments" where "listing_id" = ?'
}
{
  bindings: [ 5 ],
  sql: 'select * from "users" where "id" = ?'
}
{
  bindings: [ 12 ],
  sql: 'select * from "users" where "id" = ?'
}
{
  bindings: [ 1 ],
  sql: 'select * from "users" where "id" = ?'
}
{
  bindings: [ 19 ],
  sql: 'select * from "users" where "id" = ?'
}
```

As you can see, there are four identical select statements on the users table
where only the bindings change. This is because there are four comments on the
listing and each comment calls the author resolver and makes its own database
query. As the number of comments increases, the number of database queries would
also increase. This is a huge performance issue.

## Data Loaders

Using the example above, Data Loaders will collect the individual user IDs in
the resolver and fetch the collected user IDs in one SQL query after
[nextTick](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/).
It will then return the appropriate User object based on the supplied user ID.

We decided to use the excellent and well supported
[`dataloader`](https://github.com/graphql/dataloader) package in our project. We
then created a `SimpleLoader` to interface with our Repositories, which are
responsible for loading Database Models in batch. Here is the code:

```typescript
// utils/SimpleLoader.ts
import DataLoader from 'dataloader'

export interface Identifiable {
  id: string
}

export interface GetBatch<T extends Identifiable> {
  getBatch: (ids: readonly string[]) => Promise<T[]>
}

export class SimpleLoader<T extends Identifiable> {
  private readonly loader: DataLoader<string, T>

  constructor(protected readonly repo: GetBatch<T>) {
    this.loader = new DataLoader<string, T>(this.loadBatch.bind(this))
  }

  async load(id: string): Promise<T> {
    return await this.loader.load(id)
  }

  private async loadBatch(keys: readonly string[]): Promise<T[]> {
    const objects = await this.repo.getBatch(keys)
    const lookup = objects.reduce<Record<string, T>>((acc, object) => {
      acc[object.id] = object
      return acc
    }, {})
    return keys.map((key) => lookup[key])
  }
}
```

There are two interfaces here.

The `Identifiable` interface is meant to be implemented on the Model. It ensures
the `id` method is available for sorting the returned Models based on the order
of the `keys` input argument in `loadBatch` method.

The `GetBatch` interface is meant to be implemented on the Repository. We use
`getBatch` method to fetch Models all in one go.

For each Model & Repository pair, we will create a new `SimpleLoader`. Using the
User example above, we define a `UserLoader` like this:

```typescript
import { Service } from 'typedi'
import { SimpleLoader } from '../utils/SimpleLoader'
import { UserRepository } from '../repositories'

@Service()
export class UserLoader extends SimpleLoader<Domain.User> {
  constructor(protected readonly repo: UserRepository) {
    super(repo)
  }
}
```

We are using [`typedi`](https://github.com/typestack/typedi) for
[Dependency Injection](https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified).
We also used a feature in `typedi`, called
[Scoped Containers](https://docs.typestack.community/typedi/v/develop/#using-multiple-containers-and-scoped-containers)
to ensure each new GraphQL request will have its own empty container for
dependency injections. This is a topic for another time. The TL;DR reason for
this setup is to ensure a new instance of `UserLoader` is created in the
beginning of the request and is thrown away when the request is complete. This
is important because `dataloader` performs
[caching](https://github.com/graphql/dataloader#caching), and recommend to
initialize it during request initialization and throw it away after a request is
complete.

To use the `UserLoader`, all you have to do in your resolver is this:

```typescript
import { Service } from 'typedi'
import { UserLoader } from '../loaders'

@Service()
export class CommentResolver {
  constructor(
    private readonly loader: UserLoader,
    // a bunch of other injected services
  ) {}

  async user(@Root() comment: Comment): Promise<Domain.Listing> {
    // using the loader here
    return await this.loader.load(comment.authorId)
  }
}
```
