import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { FormStrategy } from "remix-auth-form";
import { prisma } from "~/db/db.server";
import bcrypt from "bcryptjs";
import {
  getUserById,
  getUserByUsername,
  getUserByUsername4,
  updateUserLastLogin,
} from "~/controllers/users";
import { MINION_LEVELS } from "~/models/misc";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session

export type UserType = {
  id?: string;
  username?: string;
  managerId?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
  error?: string;
  minions?: string[];
};

// can we change usertype to have all undefined fields and then set a variable to that type and undefined and the
//  the authenticator work as expected... instead of having to have isActive.. then failed authentication should
// redirect to login everytime below

export class UserClass {
  id?: string;
  username?: string;
  managerId?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
  isLoggedIn?: boolean;
  minions?: string[];

  constructor() {
    /*
    this.id = "unknown";
    this.username = "unknown";
    this.managerId = "unknown";
    this.role = "unknown";
    this.firstName = "unknown";
    this.lastName = "unknown";
    this.email = "unknown";
    this.isActive = false;
    this.isLoggedIn = false;
    this.minions = [];

     */
    this.isLoggedIn = false;
  }

  public setIsLoggedIn(ee: boolean) {
    this.isLoggedIn = ee;
  }

  public load(
    id: string,
    username: string,
    managerId: string,
    role: string,
    isActive: boolean,
    firstName: string,
    lastName: string,
    email: string,

    phone: string,
    address: string,
    minions: string[]
  ) {
    this.id = id;
    this.username = username;
    this.managerId = managerId;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone ? phone : undefined;
    this.address = address ? address : undefined;
    this.isActive = isActive;
    this.isLoggedIn = true;
    this.minions = minions;
  }
}

async function logLoginAttempt(uid: string | undefined, mesg: string) {
  const data = {
    userId: uid,
    status: mesg,
  };
  const la = await prisma.loginLog.create({ data });
  return;
}

async function login(username: string, password: string) {
  try {
    //  console.log("\n\nlogin username: " + username + " pass:" + password);

    const userFromDB =
      MINION_LEVELS == 1
        ? await getUserByUsername(username)
        : await getUserByUsername4(username);

    // console.log("\n\nlogin getuser: " + JSON.stringify(userFromDB, null, 2));

    // current grabbing minions 3 levels deep.. so COO, VP, Director -- to go deeper need to add to users list of
    // grabbing managees and loop through to flatten
    let minions: string[] = [];

    if (MINION_LEVELS == 4) {
      //
      if (userFromDB.minions.length > 0) {
        const j = 0; // this is to flatten the managees to one array.
        userFromDB.minions.map((x) => {
          //   console.log("\n\n 1st: " + JSON.stringify(x));
          //   console.log("\n\n 1stid: " + x.id);
          minions.push(x.id);
          //  console.log("\n\n minions: " + JSON.stringify(minions));
          if (x.minions.length > 0) {
            x.minions.map((xx) => {
              minions.push(xx.id);
              if (xx.minions.length > 0) {
                xx.minions.map((xxx) => {
                  minions.push(xxx.id);
                });
              }
            });
          }
        });
      }
    }
    //
    else {
      if (userFromDB.minions.length > 0) {
        const j = 0; // this is to flatten the managees to one array.
        userFromDB.minions.map((x) => {
          //   console.log("\n\n 1st: " + JSON.stringify(x));
          //   console.log("\n\n 1stid: " + x.id);
          minions.push(x.id);
          //  console.log("\n\n minions: " + JSON.stringify(minions));
        });
      }
    }

    // console.log("\n\n final minions: " + JSON.stringify(minions));

    const userPassword = userFromDB.password;
    await bcrypt.compare(password, userPassword);

    const user = new UserClass();
    user.load(
      userFromDB.id,
      userFromDB.username,
      userFromDB.managerId,
      userFromDB.role,
      userFromDB.isActive,
      userFromDB.firstName,
      userFromDB.lastName,
      userFromDB.email,
      userFromDB.phone,
      userFromDB.address,
      minions
    );

    //   console.log("\n\n auth login user: " + JSON.stringify(user, null, 2));

    await updateUserLastLogin(userFromDB.id); // updates last login date
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
        JSON.stringify({ username: username, password: password }, null, 2)
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

  // console.log("\n\n my isAuthenticated user: " + JSON.stringify(user, null, 2));

  if (user === null) {
    const user = new UserClass();
    return user;
  } else return user;
}

export async function isAuthenticatedNoRedirect(request) {
  const user = await authenticator.isAuthenticated(request, {});

  //  console.log("\n\n my isAuthenticated user: " + JSON.stringify(user, null, 2));

  if (user === null) {
    const user = new UserClass();
    return user;
  } else return user;
}
