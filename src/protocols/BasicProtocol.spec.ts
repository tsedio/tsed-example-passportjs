import { PlatformTest } from "@tsed/common";
import { User } from "../models/User";
import { UsersService } from "../services/users/UsersService";
import { BasicProtocol } from "./BasicProtocol";

async function getProtocolFixture() {
  const usersService = {
    findOne: jest.fn()
  };

  const protocol = await PlatformTest.invoke<BasicProtocol>(BasicProtocol, [
    {
      token: UsersService,
      use: usersService
    }
  ]);
  return { usersService, protocol };
}

describe("BasicProtocol", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());

  describe(".$onVerify()", () => {
    it("should return a user", async () => {
      // GIVEN
      const request = {};
      const username = "username@domain.fr";
      const password = "password";
      const user = new User();
      user.email = username;
      user.password = password;

      const { usersService, protocol } = await getProtocolFixture();
      usersService.findOne.mockResolvedValue(user);
      // WHEN
      const result = await protocol.$onVerify(request as any, username, password);

      // THEN
      expect(usersService.findOne).toBeCalledWith({ email: "username@domain.fr" });
      expect(result).toEqual(user);
    });
    it("should return a user", async () => {
      // GIVEN
      const request = {};
      const username = "username@domain.fr";
      const password = "password";
      const user = new User();
      user.email = username;
      user.password = `${password}2`;

      const { usersService, protocol } = await getProtocolFixture();
      usersService.findOne.mockResolvedValue(user);

      // WHEN
      const result = await protocol.$onVerify(request as any, username, password);

      // THEN
      expect(usersService.findOne).toBeCalledWith({ email: "username@domain.fr" });
      expect(result).toEqual(false);
    });
    it("should return a false when user isn't found", async () => {
      // GIVEN
      const request = {};
      const username = "username@domain.fr";
      const password = "password";

      const { usersService, protocol } = await getProtocolFixture();
      usersService.findOne.mockResolvedValue(undefined);

      // WHEN
      const result = await protocol.$onVerify(request as any, username, password);

      // THEN
      expect(usersService.findOne).toBeCalledWith({ email: "username@domain.fr" });
      expect(result).toEqual(false);
    });
  });
});
