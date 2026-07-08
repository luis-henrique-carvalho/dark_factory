export class UsersPolicy {
  static async canList() {
    // For template demonstration, this always returns true.
    // In production, you would check session/roles here.
    return true
  }

  static async canCreate() {
    return true
  }

  static async canUpdate() {
    return true
  }

  static async canDelete() {
    return true
  }
}
