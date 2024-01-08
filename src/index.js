import Hummingbird from "@themaximalist/hummingbird.js"
import * as controllers from "./controllers/index.js"
import Envtools from "./services/Envtools.js"
import "./models/index.js"

const hummingbird = new Hummingbird();

hummingbird.app.locals.Envtools = Envtools;

hummingbird.get("/", "index");
hummingbird.get("/history", "history");
hummingbird.get("/models", controllers.models.index);
hummingbird.get("/models/new", controllers.models.edit);
hummingbird.get("/models/:id", controllers.models.show);
hummingbird.post("/models/:id/remove", controllers.models.remove);
hummingbird.post("/models/new", controllers.models.update);
hummingbird.post("/api/v1/chat", controllers.api.chat);

await hummingbird.start();
