import { PlatformTest } from "@tsed/common";
import { CalendarsService } from "./CalendarsService";

describe("CalendarsService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  it("should return calendar by ID", () => {
    const service = PlatformTest.get<CalendarsService>(CalendarsService);
    const item = service.findOne({});

    expect(service.findById(item!._id)).toEqual(item);
  });
});
