import Hummingbird from "@themaximalist/hummingbird.js"
import * as controllers from "./controllers/index.js"
import Envtools from "./envtools.js"
import "./models/index.js"

const hummingbird = new Hummingbird();

hummingbird.app.locals.Envtools = Envtools;

hummingbird.get("/", "index");
hummingbird.get("/history", "history");
hummingbird.get("/models", controllers.models.index);
hummingbird.get("/models/new", controllers.models.edit);
hummingbird.post("/models/new", controllers.models.update);
hummingbird.get("/models/:id", controllers.models.show);

await hummingbird.start();
