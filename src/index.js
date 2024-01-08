import Hummingbird from "@themaximalist/hummingbird.js"
import * as controllers from "./controllers/index.js"
import Envtools from "./services/Envtools.js"
import "./models/index.js"


const hummingbird = new Hummingbird();

hummingbird.app.locals.Envtools = Envtools;

hummingbird.get("/", "index");
// hummingbird.get("/users/signup", "users/signup");
// hummingbird.post("/users/signup", controllers.users.signup);
// hummingbird.get("/users/login", controllers.users.login);
hummingbird.get("/history", "history");
hummingbird.post("/api/v1/chat", controllers.api.chat);

hummingbird.mount("/models", controllers.models);
// hummingbird.mount("/users", controllers.users);

await hummingbird.start();
