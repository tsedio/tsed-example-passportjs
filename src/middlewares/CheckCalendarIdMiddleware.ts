import { Middleware, PathParams, Req } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { Required } from "@tsed/schema";
import { Inject } from "@tsed/di";
import { User } from "../models/User";
import { CalendarsService } from "../services/calendars/CalendarsService";

@Middleware()
export class CheckCalendarIdMiddleware {
  @Inject()
  protected calendarsService: CalendarsService;

  async use(@Req("user") user: User, @Required() @PathParams("calendarId") calendarId: string) {
    const calendar = await this.calendarsService.findOne({
      _id: calendarId,
      owner: user._id
    });

    if (!calendar) {
      throw new NotFound("Calendar not found");
    }
  }
}
