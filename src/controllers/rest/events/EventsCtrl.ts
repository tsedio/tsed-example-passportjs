import {BodyParams, Controller, Delete, Get, PathParams, Post, Put, UseBefore} from "@tsed/common";
import {Required, Returns} from "@tsed/schema";
import {Authenticate, Authorize} from "@tsed/passport";
import {NotFound} from "@tsed/exceptions";
import {CheckCalendarIdMiddleware} from "../../../middlewares/CheckCalendarIdMiddleware";
import {CalendarCreation} from "../../../models/Calendar";
import {Event, EventCreation} from "../../../models/Event";
import {Task} from "../../../models/Task";
import {CalendarEventsService} from "../../../services/events/CalendarEventsService";

@Controller("/:calendarId/events")
@UseBefore(CheckCalendarIdMiddleware)
export class EventsCtrl {
  constructor(private calendarEventsService: CalendarEventsService) {
  }

  @Get("/:id")
  @Returns(200, Event)
  @Returns(404).Description("Event not found")
  @Authorize("*")
  async get(@Required() @PathParams("calendarId") calendarId: string, @PathParams("id") id: string): Promise<Event> {
    const event = await this.calendarEventsService.findById(id);

    if (!event) {
      throw new NotFound("Event not found");
    }

    return event;
  }

  @Get("/:id/tasks")
  @Authorize("*")
  async getTasks(@Required() @PathParams("calendarId") calendarId: string, @PathParams("id") id: string): Promise<Task[]> {
    const event = await this.get(calendarId, id);

    return event.tasks;
  }

  @Put("/")
  @Returns(201, Event)
  @Authorize("*")
  async create(@Required() @PathParams("calendarId") calendarId: string, @BodyParams() event: EventCreation): Promise<Event> {
    return this.calendarEventsService.create({...event, calendarId});
  }

  @Post("/:id")
  @Authorize("*")
  async update(
    @Required() @PathParams("calendarId") calendarId: string,
    @PathParams("id") id: string,
    @BodyParams() event: CalendarCreation
  ): Promise<Event> {
    const updatedEvent = await this.calendarEventsService.update({...event, _id: id, calendarId});

    if (!updatedEvent) {
      throw new NotFound("Event not found");
    }

    return updatedEvent;
  }

  @Delete("/:id")
  @Authenticate()
  @Returns(204)
  @Authorize("*")
  async remove(@Required() @PathParams("calendarId") calendarId: string, @PathParams("id") id: string) {
    if (!(await this.calendarEventsService.removeOne({_id: id, calendarId}))) {
      throw new NotFound("Event not found");
    }

    return null;
  }

  @Get("/")
  @Authorize("*")
  async getAll(@Required() @PathParams("calendarId") calendarId: string): Promise<Event[]> {
    return this.calendarEventsService.findAll({calendarId});
  }
}
