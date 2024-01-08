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
hummingbird.get("/history", "history");
hummingbird.post("/api/v1/chat", controllers.api.chat);

hummingbird.mount("/models", controllers.models);
hummingbird.mount("/users", controllers.users);

await Database.initialize();
await hummingbird.start();
