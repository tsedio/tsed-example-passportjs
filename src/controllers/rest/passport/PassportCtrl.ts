import {BodyParams, Controller, Get, Post, Req} from "@tsed/common";
import {Authenticate, Authorize} from "@tsed/passport";
import {Credentials} from "../../../models/Credentials";
import {User} from "../../../models/User";
import {UserCreation} from "../../../models/UserCreation";
import {Groups, Returns, Security} from "@tsed/schema";

@Controller("/auth")
export class PassportCtrl {
  @Post("/login")
  @Authenticate("login", {failWithError: false})
  @Returns(200, User).Groups("read")
  @Returns(400).Description("Validation error")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Req() req: Req, @BodyParams() @Groups("credentials") credentials: Credentials) {
    // FACADE
    return req.user;
  }

  @Post("/signup")
  @Returns(201, User).Groups("read")
  @Authenticate("signup")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signup(@Req() req: Req, @BodyParams() @Groups("create") user: UserCreation) {
    // FACADE
    return req.user;
  }

  @Get("/userinfo")
  @Authenticate("basic")
  @Security("auth:basic")
  @Returns(200, User).Groups("read")
  getUserInfo(@Req() req: Req) {
    // FACADE
    return req.user;
  }

  @Get("/logout")
  logout(@Req() req: Req) {
    req.logout();
  }

  @Get("/connect/:protocol")
  @Authorize(":protocol")
  @Returns(200, User)
  connectProtocol(@Req() req: Req) {
    // FACADE
    return req.user;
  }

  @Get("/connect/:protocol/callback")
  @Authorize(":protocol")
  @Returns(200, User)
  connectProtocolCallback(@Req() req: Req) {
    // FACADE
    return req.user;
  }
}
