import { BodyParams, Req } from "@tsed/common";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { Strategy } from "passport-local";
import { Forbidden } from "@tsed/exceptions";
import { UserCreation } from "../models/UserCreation";
import { UsersService } from "../services/users/UsersService";
import { Inject } from "@tsed/di";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify, OnInstall {
  @Inject()
  private usersService: UsersService;

  async $onVerify(@Req() request: Req, @BodyParams() user: UserCreation) {
    const { email } = user;
    const found = await this.usersService.findOne({ email });

    if (found) {
      throw new Forbidden("Email is already registered");
    }

    return this.usersService.create(user);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
