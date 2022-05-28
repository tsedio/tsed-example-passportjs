import { Event } from "../../../models/Event";
import { Task } from "../../../models/Task";
import { CalendarEventsService } from "../../../services/events/CalendarEventsService";
import { EventsCtrl } from "./EventsCtrl";
import { PlatformTest } from "@tsed/common";

async function getControllerFixture() {
  const calendarEventsService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    removeOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };

  const eventsCtrl: EventsCtrl = await PlatformTest.invoke(EventsCtrl, [
    {
      token: CalendarEventsService,
      use: calendarEventsService
    }
  ]);
  return { calendarEventsService, eventsCtrl };
}

describe("EventsCtrl", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe("get()", () => {
    it("should return a event", async () => {
      // GIVEN
      const event = new Event();
      const { calendarEventsService, eventsCtrl } = await getControllerFixture();
      calendarEventsService.findById.mockResolvedValue(event);
      // WHEN
      const result = await eventsCtrl.get("calendarId", "id");

      // THEN
      expect(result).toEqual(event);
      expect(calendarEventsService.findById).toBeCalledWith("id");
    });
    it("should throw error", async () => {
      // GIVEN
      const { calendarEventsService, eventsCtrl } = await getControllerFixture();
      calendarEventsService.findById.mockResolvedValue(undefined);

      // WHEN
      let actualError: any;
      try {
        await eventsCtrl.get("calendarId", "1");
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError.message).toEqual("Event not found");
    });
  });
  describe(".getTasks()", () => {
    it("should return a tasks event", async () => {
      // GIVEN
      const event = new Event();
      event.tasks = [new Task()];

      const { calendarEventsService, eventsCtrl } = await getControllerFixture();
      calendarEventsService.findById.mockResolvedValue(event);

      // WHEN
      const result = await eventsCtrl.getTasks("calendarId", "id");

      // THEN
      expect(result).toEqual(event.tasks);
    });
  });
  describe("create()", () => {
    it("should create a event", async () => {
      // GIVEN
      const event = new Event();
      event.startDate = new Date();
      event.endDate = new Date();

      const { calendarEventsService, eventsCtrl } = await getControllerFixture();
      calendarEventsService.create.mockResolvedValue(event);

      // WHEN
      const result = await eventsCtrl.create("calendarId", event);

      // THEN
      expect(result).toEqual(event);
      expect(calendarEventsService.create).toBeCalledWith({ ...event, calendarId: "calendarId" });
    });
  });
  describe("update()", () => {
    it("should return a event", async () => {
      // GIVEN
      const event = new Event();
      event.startDate = new Date();
      event.endDate = new Date();

      const { calendarEventsService, eventsCtrl } = await getControllerFixture();
      calendarEventsService.update.mockResolvedValue(event);

      // WHEN
      const result = await eventsCtrl.update("calendarId", "1", event);

      // THEN
      expect(result).toEqual(event);
      expect(calendarEventsService.update).toBeCalledWith({ ...event, _id: "1", calendarId: "calendarId" });
    });

    it("should throw error", async () => {
      // GIVEN
      const event = new Event();
      event.startDate = new Date();
      event.endDate = new Date();

      const { calendarEventsService, eventsCtrl } = await getControllerFixture();
      calendarEventsService.update.mockResolvedValue(undefined);

      // WHEN
      let actualError: any;
      try {
        await eventsCtrl.update("calendarId", "1", event);
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError.message).toEqual("Event not found");
    });
  });
  describe("remove()", () => {
    it("should return a removed event", async () => {
      // GIVEN
      const event = new Event();
      event.startDate = new Date();
      event.endDate = new Date();

      const { calendarEventsService, eventsCtrl } = await getControllerFixture();
      calendarEventsService.removeOne.mockResolvedValue(event);

      // WHEN
      await eventsCtrl.remove("calendarId", "1");

      // THEN
      expect(calendarEventsService.removeOne).toBeCalledWith({ _id: "1", calendarId: "calendarId" });
    });

    it("should throw error", async () => {
      // GIVEN
      const { calendarEventsService, eventsCtrl } = await getControllerFixture();
      calendarEventsService.removeOne.mockResolvedValue(undefined);

      // WHEN
      let actualError: any;
      try {
        await eventsCtrl.remove("calendarId", "1");
      } catch (er) {
        actualError = er;
      }

      // THEN
      expect(actualError.message).toEqual("Event not found");
    });
  });
  describe("getAll()", () => {
    it("should return all events", async () => {
      // GIVEN
      const event = new Event();
      const { calendarEventsService, eventsCtrl } = await getControllerFixture();
      calendarEventsService.findAll.mockResolvedValue([event]);

      // WHEN
      const result = await eventsCtrl.getAll("calendarId");

      // THEN
      expect(result).toEqual([event]);
      expect(calendarEventsService.findAll).toBeCalledWith({ calendarId: "calendarId" });
    });
  });
});
