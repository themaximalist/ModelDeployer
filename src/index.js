import Hummingbird from "@themaximalist/hummingbird.js"
import * as controllers from "./controllers/index.js"
import Envtools from "./services/Envtools.js"
import Database from "./database.js"
import * as middleware from "./middleware.js"
import "./models/index.js"


const hummingbird = new Hummingbird();

hummingbird.app.locals.Envtools = Envtools;
hummingbird.app.use(middleware.loggedInUser);

hummingbird.get("/", "index");

hummingbird.mount("/users", controllers.users);
hummingbird.mount("/admin", controllers.models);
hummingbird.mount("/admin", controllers.events);

hummingbird.post("/api/v1/chat", controllers.api.chat);

await Database.initialize();
await hummingbird.start();
