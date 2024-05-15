export class OpportunityType {
  public static validOpportunityTypes: string[] = ["L", "O"];

  public static isOpportunityTypeValid(
    rr: string | undefined
  ): string | undefined {
    let rval;
    if (rr != undefined) {
      rval = this.validOpportunityTypes.find((r) => r === rr);
    }
    if (rval === undefined) rval = "L";
    return rval;
  }

  public static isLead(rr: string): boolean {
    return rr === "L";
  }

  public static lead(): string {
    return "L";
  }

  public static opportunity(): string {
    return "O";
  }

  public static isOpportunity(rr: string): boolean {
    return rr === "O";
  }
}
