export class Roles {
  public static validRoles: string[] = ["Admin", "Manager", "User"];

  public static isRoleValid(rr: string | undefined): string | undefined {
    let rval;
    if (rr != undefined) {
      rval = this.validRoles.find((r) => r === rr);
    }
    if (rval === undefined) rval = "User";
    return rval;
  }

  public static userRole(): string {
    return "User";
  }

  public static managerRole(): string {
    return "Manager";
  }

  public static adminRole(): string {
    return "Admin";
  }

  public static isAdmin(rr: string): boolean {
    return rr === "Admin";
  }

  public static isManager(rr: string): boolean {
    return rr === "Manager";
  }

  public static isAdminOrManager(rr: string): boolean {
    return rr === "Manager" || rr === "Admin";
  }

  public static isUser(rr: string): boolean {
    return rr === "User";
  }
}
