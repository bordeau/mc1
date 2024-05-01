# Welcome to MC1 the next iteration of NSF CRM

📖Building a CRM as an experiment using Remix, Remix Auth, React, SQLite,
Prisma, Zod, Resend

## Development

Setup DB
```sh

npx prisma migrate dev --name "initial migration"
```

To add the 1st user

```sh

tsc prisma/seed.ts
mv prisma/seed.js prisma/seed.cjs
node prisma/seeds.cjs

```

Run the Vite dev server:
s
```shellscript
npm run dev
```

## Deployment   i'm not this far yet

First, build your app for production:

```sh
npm run build
```


Then run the app in production mode:    i'm not this far yet

```sh
npm start
```

Now you'll need to pick a host to deploy it to.     i'm not this far yet

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
