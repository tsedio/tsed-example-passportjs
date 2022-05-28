import { Configuration } from "@tsed/di";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/passport";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import session from "express-session";
import { config } from "./config";
import * as rest from "./controllers/rest";
import * as pages from "./controllers/pages";
import "./protocols";

@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8083,
  httpsPort: false, // CHANGE
  componentsScan: false,
  mount: {
    "/rest": [...Object.values(rest)],
    "/": [...Object.values(pages)]
  },
  middlewares: [
    cors(),
    cookieParser(),
    compress({}),
    methodOverride(),
    session({
      secret: "mysecretkey",
      resave: true,
      saveUninitialized: true,
      // maxAge: 36000,
      cookie: {
        path: "/",
        httpOnly: true,
        secure: false
        // maxAge: null
      }
    })
  ]
})
export class Server {}
