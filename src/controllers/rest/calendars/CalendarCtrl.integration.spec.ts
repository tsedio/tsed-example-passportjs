import {PlatformTest} from "@tsed/common";
import SuperTest from "supertest";
import {Server} from "../../../Server";

describe("Calendars", () => {
  let agent: SuperTest.SuperTest<SuperTest.Test>;
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  beforeAll(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    const app = PlatformTest.callback();
    agent = SuperTest.agent(app);
    request = SuperTest(app);

    await agent.post("/rest/auth/login").send({
      email: "amy.riley@undefined.io",
      password: "583538ea97489c137ad54db5"
    }).expect(200);
  });
  afterAll(() => PlatformTest.reset());

  // then run your test
  describe("GET /rest/calendars", () => {
    it("should return all calendars with login process", async () => {
      const response = await agent.get("/rest/calendars").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it("should fail when the user is not authenticated", async () => {
      const response = await request.get("/rest/calendars").expect(401);

      expect(response.body).toEqual({
        "name": "AuthenticationError",
        "message": "Unauthorized",
        "status": 401,
        "errors": []
      });
    });
  });
});
