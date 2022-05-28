import { UsersService } from "./UsersService";
import { PlatformTest } from "@tsed/common";

describe("UsersService", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);
  it("should return calendar by ID", () => {
    const service = PlatformTest.get<UsersService>(UsersService);
    const item = service.findOne({});

    expect(service.findById(item!._id)).toEqual(item);
  });
});
