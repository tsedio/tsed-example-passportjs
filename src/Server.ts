import "@tsed/ajv";
import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/passport";
import "@tsed/platform-express";
import "@tsed/swagger";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import methodOverride from "method-override";
import {CalendarCtrl} from "./controllers/calendars/CalendarCtrl";
import {PassportCtrl} from "./controllers/passport/PassportCtrl";
import {User} from "./models/User";

const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  logger: {
    debug: false,
    logRequest: true,
    requestFields: ["reqId", "method", "url", "headers", "query", "params", "duration"]
  },
  componentsScan: [
    `${rootDir}/services/**/*.ts`,
    `${rootDir}/protocols/**/*.ts`
  ],
  mount: {
    "/rest": [
      CalendarCtrl,
      PassportCtrl
    ]
  },
  swagger: [{
    path: "/api-docs"
  }],
  calendar: {
    token: true
  },
  passport: {
    userInfoModel: User
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  $beforeRoutesInit(): void | Promise<any> {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      .use(session({
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
      }));
  }
}
