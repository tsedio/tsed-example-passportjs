import {Description, Example, Format, Groups, Required} from "@tsed/schema";

export class Credentials {
  @Description("User password")
  @Example("/5gftuD/")
  @Required()
  @Groups("create", "update", "credentials")
  password: string;

  @Description("User email")
  @Example("user@domain.com")
  @Format("email")
  @Required()
  email: string;
}
