import { CalendarEventsService } from "./CalendarEventsService";
import { PlatformTest } from "@tsed/common";

describe("CalendarEventsService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  it("should return calendar by ID", () => {
    const service = PlatformTest.get<CalendarEventsService>(CalendarEventsService);
    const item = service.findOne({});

    expect(service.findById(item!._id)).toEqual(item);
  });
});
