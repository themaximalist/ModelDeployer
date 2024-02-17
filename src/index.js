import Hummingbird from "@themaximalist/hummingbird.js"
import * as controllers from "./controllers/index.js"
import Envtools from "./services/Envtools.js"
import Database from "./database.js"
import * as middleware from "./middleware.js"
import "./models/index.js"

const hummingbird = new Hummingbird();

hummingbird.app.locals.Envtools = Envtools;
hummingbird.app.use(middleware.loggedInUser);
hummingbird.app.use(middleware.apiUser);
hummingbird.app.use(middleware.helpers);

hummingbird.get("/", "index");
hummingbird.get("/blog", "blog/index");
hummingbird.get("/blog/modeldeployer-launches", "blog/modeldeployer-launches");

hummingbird.mount("/users", controllers.users);
hummingbird.mount("/admin", controllers.models);
hummingbird.mount("/admin", controllers.events);
hummingbird.mount("/admin", controllers.apikeys);

hummingbird.post("/api/v1/chat", controllers.api.chat);
hummingbird.post("/api/v1/embeddings", controllers.api.embeddings);

await Database.initialize();
await hummingbird.start();
