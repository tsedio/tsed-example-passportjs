import { PlatformTest } from "@tsed/common";
import { Calendar } from "../../../models/Calendar";
import { User } from "../../../models/User";
import { CalendarsService } from "../../../services/calendars/CalendarsService";
import { CalendarCtrl } from "./CalendarCtrl";

async function getControllerFixture() {
  const calendarsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    removeOne: jest.fn()
  };

  const calendarController = await PlatformTest.invoke<CalendarCtrl>(CalendarCtrl, [
    {
      token: CalendarsService,
      use: calendarsService
    }
  ]);

  return { calendarsService, calendarController };
}

describe("CalendarsCtrl", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("get()", () => {
    it("should return a calendar", async () => {
      // GIVEN
      const calendar = new Calendar();
      const user = new User();
      user._id = "u1";

      const { calendarsService, calendarController } = await getControllerFixture();
      calendarsService.findOne.mockResolvedValue(calendar);

      // WHEN
      const result = await calendarController.get(user, "1");

      // THEN
      expect(result).toEqual(calendar);
      expect(calendarsService.findOne).toBeCalledWith({ _id: "1", owner: user._id });
    });
    it("should throw error", async () => {
      // GIVEN
      const user = new User();
      user._id = "u1";

      const { calendarsService, calendarController } = await getControllerFixture();
      calendarsService.findOne.mockResolvedValue(undefined);

      // WHEN
      let actualError: any;
      try {
        await calendarController.get(user, "1");
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError.message).toEqual("Calendar not found");
    });
  });
  describe("create()", () => {
    it("should create a calendar", async () => {
      // GIVEN
      const calendar = new Calendar();
      calendar._id = "1";
      calendar.name = "name";

      const user = new User();
      user._id = "u1";

      const { calendarsService, calendarController } = await getControllerFixture();
      calendarsService.create.mockResolvedValue(calendar);

      // WHEN
      const result = await calendarController.create(user, { name: "name" });

      // THEN
      expect(result).toEqual(calendar);
      expect(calendarsService.create).toBeCalledWith({ name: "name" });
    });
  });
  describe("update()", () => {
    it("should return a calendar", async () => {
      // GIVEN
      const calendar = new Calendar();
      const user = new User();
      user._id = "u1";

      const { calendarsService, calendarController } = await getControllerFixture();
      calendarsService.update.mockResolvedValue(calendar);
      calendarsService.findOne.mockResolvedValue(calendar);

      // WHEN
      const result = await calendarController.update(user, "1", { name: "name" });

      // THEN
      expect(result).toEqual(calendar);
      expect(calendarsService.findOne).toBeCalledWith({ _id: "1", owner: user._id });
      expect(calendarsService.update).toBeCalledWith({ _id: "1", name: "name" });
    });

    it("should throw error", async () => {
      // GIVEN
      const user = new User();
      user._id = "u1";

      const { calendarsService, calendarController } = await getControllerFixture();
      calendarsService.update.mockResolvedValue(undefined);
      calendarsService.findOne.mockResolvedValue(undefined);

      // WHEN
      let actualError: any;
      try {
        await calendarController.update(user, "1", { name: "name" });
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError.message).toEqual("Calendar not found");
    });
  });
  describe("remove()", () => {
    it("should return a removed calendar", async () => {
      // GIVEN
      const calendar = new Calendar();
      const user = new User();
      user._id = "u1";

      const { calendarsService, calendarController } = await getControllerFixture();
      calendarsService.removeOne.mockResolvedValue(calendar);

      // WHEN
      await calendarController.remove(user, "1");

      // THEN
      expect(calendarsService.removeOne).toBeCalledWith({ _id: "1", owner: user._id });
    });

    it("should throw error", async () => {
      // GIVEN
      const user = new User();
      user._id = "u1";

      const { calendarsService, calendarController } = await getControllerFixture();
      calendarsService.removeOne.mockResolvedValue(undefined);

      // WHEN
      let actualError: any;
      try {
        await calendarController.remove(user, "1");
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError.message).toEqual("Calendar not found");
    });
  });
  describe("getAll()", () => {
    it("should return all calendars", async () => {
      // GIVEN
      const calendar = new Calendar();

      const { calendarsService, calendarController } = await getControllerFixture();
      calendarsService.findAll.mockResolvedValue([calendar]);

      // WHEN
      const result = await calendarController.getAll("1", "name", "owner");

      // THEN
      expect(result).toEqual([calendar]);
      expect(calendarsService.findAll).toBeCalledWith({ _id: "1", name: "name", owner: "owner" });
    });
  });
});
