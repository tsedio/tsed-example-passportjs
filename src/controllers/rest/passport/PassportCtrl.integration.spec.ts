import { PlatformTest } from "@tsed/common";
import SuperTest from "supertest";
import { Server } from "../../../Server";

describe("Auth", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  // bootstrap your expressApplication in first
  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(() => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  describe("POST /rest/auth/login", () => {
    describe("when credential isn't given", () => {
      it("should respond 400", async () => {
        const response = await request.post("/rest/auth/login").send({}).expect(400);

        expect(response.body).toEqual({"errors": [], "message": "Bad Request", "name": "AuthenticationError", "status": 400});
      });
    });
    describe("when credential is given but is wrong", () => {
      it("should respond 401", async () => {
        const response = await request.post("/rest/auth/login").send({ email: "test@test.fr", password: "12345" }).expect(401);

        expect(response.body).toEqual({"errors": [], "message": "Unauthorized", "name": "AuthenticationError", "status": 401});
      });
    });
    describe("when credential is given but email is invalid", () => {
      it("should respond 400", async () => {
        const response = await request.post("/rest/auth/login").send({ email: "test_test.fr", password: "12345" }).expect(400);

        expect(response.body).toEqual({
          "errors": [
            {
              "data": "test_test.fr",
              "dataPath": ".email",
              "instancePath": "/email",
              "keyword": "format",
              "message": "must match format \"email\"",
              "modelName": "Credentials",
              "params": {
                "format": "email"
              },
              "schemaPath": "#/properties/email/format"
            }
          ],
          "message": "Bad request on parameter \"request.body\".\nCredentials.email must match format \"email\". Given value: \"test_test.fr\"",
          "name": "AJV_VALIDATION_ERROR",
          "status": 400
        });
      });
    });
    describe("when credential is given", () => {
      it("should respond 200 and return the user", async () => {
        const response = await request
          .post("/rest/auth/login")
          .send({ email: "amy.riley@undefined.io", password: "583538ea97489c137ad54db5" })
          .expect(200);

        expect(response.body).toMatchObject({
          firstName: "Amy",
          lastName: "Riley",
          email: "amy.riley@undefined.io",
          phone: "+1 (841) 438-3631",
          address: "399 Pilling Street, Verdi, North Carolina, 5810"
        });
        expect(response.body).not.toHaveProperty("password");
        expect(response.body).toHaveProperty("_id");
      });
    });
  });

  describe("POST /rest/auth/signup", () => {
    describe("when credential isn't given", () => {
      it("should respond 400", async () => {
        const response = await request.post("/rest/auth/signup").send({}).expect(400);

        expect(response.body).toEqual({"errors": [], "message": "Bad Request", "name": "AuthenticationError", "status": 400});
      });
    });

    describe("when credential is given but email is invalid", () => {
      it("should respond 403", async () => {
        const response = await request
          .post("/rest/auth/signup")
          .send({
            firstName: "Wendi",
            lastName: "Small",
            password: "test",
            email: "wendi.small_undefined.net"
          })
          .expect(400);

        expect(response.body).toEqual({
          "errors": [
            {
              "data": "wendi.small_undefined.net",
              "dataPath": ".email",
              "instancePath": "/email",
              "keyword": "format",
              "message": "must match format \"email\"",
              "modelName": "UserCreation",
              "params": {
                "format": "email"
              },
              "schemaPath": "#/properties/email/format"
            }
          ],
          "message": "Bad request on parameter \"request.body\".\nUserCreation.email must match format \"email\". Given value: \"wendi.small_undefined.net\"",
          "name": "AJV_VALIDATION_ERROR",
          "status": 400
        });
      });
    });

    describe("when credential is given but the email is already registered", () => {
      it("should respond 403", async () => {
        const response = await request
          .post("/rest/auth/signup")
          .send({
            firstName: "Wendi",
            lastName: "Small",
            email: "wendi.small@undefined.net",
            password: "utest"
          })
          .expect(403);

        expect(response.body).toEqual({"errors": [], "message": "Email is already registered", "name": "FORBIDDEN", "status": 403});
      });
    });

    describe("when credential is given", () => {
      it("should respond 200 and return the user", async () => {
        const response = await request
          .post("/rest/auth/signup")
          .send({
            firstName: "Wendi",
            lastName: "Small",
            password: "test",
            email: "wendi.small@console.net"
          })
          .expect(201);

        expect(response.body).toMatchObject({
          email: "wendi.small@console.net",
          firstName: "Wendi",
          lastName: "Small"
        });

        expect(response.body).not.toHaveProperty("password");
        expect(response.body).toHaveProperty("_id");
      });
    });
  });
});
