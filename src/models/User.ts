import {Description} from "@tsed/schema";
import {UserCreation} from "./UserCreation";

export class User extends UserCreation {
  @Description("Database assigned id")
  _id: string;

  verifyPassword(password: string) {
    return this.password === password;
  }
}
