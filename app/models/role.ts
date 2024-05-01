export class Roles {
  public static validRoles: string[] = ["Admin", "Manager", "User", "Pending"];

  public static isRoleValid(rr: string | undefined): string | undefined {
    let rval;
    if (rr != undefined) {
      rval = this.validRoles.find((r) => r === rr);
    }
    if (rval === undefined) rval = "Pending";
    return rval;
  }

  public static isAdmin(rr: string): boolean {
    return rr === "Admin";
  }

  public static isManager(rr: string): boolean {
    return rr === "Manager";
  }

  public static isUser(rr: string): boolean {
    return rr === "User";
  }

  public static isPending(rr: string): boolean {
    return rr === "Pending";
  }
}
