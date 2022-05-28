import { PlatformTest } from "@tsed/common";
import { Calendar } from "../models/Calendar";
import { User } from "../models/User";
import { CalendarsService } from "../services/calendars/CalendarsService";
import { CheckCalendarIdMiddleware } from "./CheckCalendarIdMiddleware";

function getMiddlewareFixture() {
  const calendarsService = {
    findOne: jest.fn()
  };
  const middleware = PlatformTest.invoke(CheckCalendarIdMiddleware, [
    {
      token: CalendarsService,
      use: calendarsService
    }
  ]);

  return { calendarsService, middleware };
}

describe("CheckCalendarIdMiddleware", () => {
  beforeEach(async () => {
    await PlatformTest.create();
  });
  afterEach(() => PlatformTest.reset());

  it("should return nothing", async () => {
    // GIVEN
    const user = new User();
    user._id = "u1";
    const calendar = new Calendar();

    const { calendarsService, middleware } = getMiddlewareFixture();
    calendarsService.findOne.mockResolvedValue(calendar);

    // WHEN
    const result = await middleware.use(user, "1");

    // THEN
    expect(result).toBeUndefined();
    expect(calendarsService.findOne).toBeCalledWith({ _id: "1", owner: user._id });
  });

  it("should throw error", async () => {
    // GIVEN
    const user = new User();
    user._id = "u1";

    const { calendarsService, middleware } = getMiddlewareFixture();
    calendarsService.findOne.mockResolvedValue(undefined);

    // WHEN
    let actualError: any;
    try {
      await middleware.use(user, "1");
    } catch (er) {
      actualError = er;
    }

    // THEN
    expect(actualError.message).toEqual("Calendar not found");
  });
});
