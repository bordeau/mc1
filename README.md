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


Status as of 5/9 at 9:30pm

Currently has authentication, user register request (requires approval) with email receipt and admin notification, change password, reset forgotten password - sends email to user's email of record, manage users, manage user registration requests, org (SF account) with type and industry lookups, people (SF contact), person can be associated with 0 or more orgs, and vice versa, opportunity with source, status, type lookups and teams (next to implemented), dashboard with a few component examples.  Generally there are CruD for all.  the lookups feature isactive and custom ordering, and are generic and easily cloneable by cloning the 6 routes and making minor changes.  the emails are using react email for templates with resend to send the email.  uses bootstrap for css.

currently login cookie doesn't expire so login is indefinite, this needs to change to something reasonable like 2 hours or less if update the login session cookie often enough to auto extend it.

there is no separate lead vs opportunity.. they are the same.  a lead is a type of opportunity

also opportunity history. any field change

once all above is working to my expectation.  the 1st phase is done

2nd phase will include some example reporting and maybe events/activities, maybe some kind of publish subscribe event kind of thing for notifications when something happens??

3rd phase will be securing access to records with owners (currently persons, orgs, opportunities).  currently, anyone can crud any of these records even though each record has an owner.  only the owner can change owner in at least one of the 3.  the next step is to implement security based on owner.

1st will be only owner and owner's manager(s) can CRUD 
2nd same as 1st except -- anyone can view
3rd implement sharing, where anyone that can view can share, anyone that can crud can share crud

since each of these will require updating the data getters maybe have a diff controller for each where the base get is the same name, just make available by importing the correct controller for the owner security variation???.. probably should split the update, create and delete from the gets to make that less duplication

if there is a 4th phase, i dunno.. sellable items, inventory, sales order.. hopefully no 4th phase unless i'm totally bored