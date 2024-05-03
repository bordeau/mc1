# Welcome to MC1 the next iteration of NSF CRM

📖Building a CRM as an experiment using Remix, Remix Auth, React, SQLite,
Prisma, Zod, Resend, React Email, Bootstrap, ???.

This is not tested much as of now.  The current routes seems to be running fairly well as of this update.  For authentication it uses Remix Auth with the Form strategy.  

So far there is login, logout, self registration (current implementation inserts request into registration table, notifies Admin via email, requires Admin approval, which also creates user record and notifies new user to create password via email), forgot password, change password for logged in user, forgot password has form to fill in username and email then sends email to user with link to set new password.  The emails are via Resend  using React Email for React email templating. 

Most of the forms use Zod for validation.

The styling there is my limited knowledge of Bootstrap.

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
