### Original task

You can find original task description [here](./docs/README.md)

### Tech stack description

I partly implemented backend part, because i'm curious for full stack development.

Project use next solutions:

- Typescript
- Nextjs
- Prisma
- GraphQL: Apollo server \ client
- Google Maps
- SQLite
- SASS
- Jest \ Enzyme

I had chosen `typescript` because it allows to describe complex types, match them with each other, has great community and has a lot of integrations with different libraries.

I have use `Nextjs` as primary framework, because it uses React as view lib and allows to easily define simple backend endpoints, what i need to use `graphql`

`prisma` was chosen as db agnostic orm which has good support and features, also it used to generate `graphql` resolvers and schemas, because we need crud api for our db

`sqlite` was chosen because it is simple to use and reliable for our purpose

`sass` was chosen to extend basic css features and simplify complex layouts description

`jest \ enzyme` were chosen because they are simple, popular and has great community support, also some tests (snapshots \ unit test) may overlap testing functionality, but it is just to show that we may use different ways to test something

### How to run code

First, you need to set up your local `.env` file with variables, you use may `.env.example` as template.

Project has `js` based stack, so just install dependencies with:

```
yarn
```

and run:

```
yarn dev
```

also you may open prisma studio to inspect db, to run it, just execute:

```
yarn prisma:studio
```

to run tests, just execute:

```
yarn test:ci
```


### Under the hood

`unsplash` api used only when we seed db and only to get random avatar images.

`apollo client` used both, at server and at client sides, but with different logic.

Not all interfaces has error \ loading states, only few of them, because it is test task neither production ready implementation.

I didn't set up any linters because it wasn't mentioned in task description and my IDE has predefined code styles for me.

I choose SSR generation over SSG, because users data is not persistent, and we may modify it, so SSG has no sense.

After we render page at server side, we fill `graphql` client cache with data to avoid unnecessary requests.

Pagination logic based on prisma api.

Users filtering has only client side implementation, it based on `name`, `description` and `address` fields from user model.

After we load additional users data, we force browser to scroll to `load more` button, to left smooth user experience.

I prevent user input operations during data loading processes and overlay animations.

### Mobile optimizations

All layouts are adaptive and should look good on mobile screens.

### Possible improvements

- introduce any state manager, to increase project scalability and components decomposition
- add `pwa` support, and tune concrete application props in manifest file
- add script linting rules and unify code style in whole team
- add precommit hooks for additional validation and linting
- restrict apollo client
