export interface IUser {
  id: string;
  email: string;
  username: string;
  plan: "free" | "premium";
  profile: string;
  created_at: Date;
}

export class User implements IUser {
  id: string;
  email: string;
  username: string;
  plan: "free" | "premium";
  profile: string;
  created_at: Date;

  constructor(userData: Partial<IUser>) {
    this.id = userData.id!;
    this.email = userData.email!;
    this.username = userData.username!;
    this.plan = userData.plan || "free";
    this.profile = userData.profile || "";
    this.created_at = userData.created_at || new Date();
  }

  isPremiumUser(): boolean {
    return this.plan === "premium";
  }
}
