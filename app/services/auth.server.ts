import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import { prisma } from "~/db/db.server";
import bcrypt from "bcryptjs";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session

export type UserType = {
  id: string;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  error?: string;
};

export class UserClass {
  id: string;
  username: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  isLoggedIn: boolean;

  constructor() {
    this.id = "unknown";
    this.username = "unknown";
    this.role = "unknown";
    this.firstName = "unknown";
    this.lastName = "unknown";
    this.email = "unknown";
    this.isActive = false;
    this.isLoggedIn = false;
  }

  public setIsLoggedIn(ee: boolean) {
    this.isLoggedIn = ee;
  }

  public load(
    id: string,
    username: string,
    role: string,
    isActive: boolean,
    firstName: string,
    lastName: string,
    email: string,

    phone: string,
    address: string
  ) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone ? phone : undefined;
    this.address = address ? address : undefined;
    this.isActive = isActive;
    this.isLoggedIn = true;
  }
}

async function logLoginAttempt(uid: string | undefined, mesg: string) {
  const data = {
    userId: uid,
    status: mesg,
  };
  const la = await prisma.loginLog.create({ data });
  /*
  console.log(
    "\n\n auth log login attempt: " +
      uid +
      " mesg:" +
      "la:" +
      JSON.stringify(la)
  );
*/
  return;
}

async function login(username: string, password: string) {
  try {
    const userFromDB = await prisma.users.findUniqueOrThrow({
      where: {
        username: username,
      },
    });
    const userPassword = userFromDB.password;

    await bcrypt.compare(password, userPassword);

    const user = new UserClass();
    user.load(
      userFromDB.id,
      userFromDB.username,
      userFromDB.role,
      userFromDB.isActive,
      userFromDB.firstName,
      userFromDB.lastName,
      userFromDB.email,
      userFromDB.phone,
      userFromDB.address
    );

    // console.log("\n\n auth login user: " + JSON.stringify(user));

    await logLoginAttempt(userFromDB.id, "success");

    return user;
  } catch (e) {
    console.log("\n\n auth login error: " + JSON.stringify(e, null, 2));
    await logLoginAttempt(undefined, JSON.stringify(e));
    const user: UserClass = new UserClass();
    return user;
  }
}

export const authenticator = new Authenticator<UserClass>(sessionStorage, {
  throwOnError: true,
});

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    /*
    console.log(
      "\n\n in authenticator username/password: " +
        JSON.stringify({ username: username, password: password }, null, 2 )
    );

     */

    const user = await login(username, password);

    // console.log("\n\n in authenticator user: " + JSON.stringify(user, null, 2));

    // the type of this user must match the type you pass to the Authenticator
    // the strategy will automatically inherit the type if you instantiate
    // directly inside the `use` method

    return user;
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass"
);

export async function isAuthenticated(request) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  //  console.log("\n\n my isAuthenticated user: " + JSON.stringify(user, null, 2));

  if (user === null) return undefined;
  else return user;
}

export async function isAuthenticatedNoRedirect(request) {
  const user = await authenticator.isAuthenticated(request, {});

  //console.log("\n\n my isAuthenticated user: " + JSON.stringify(user, null, 2));

  if (user === null) return undefined;
  else return user;
}
