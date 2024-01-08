import Hummingbird from "@themaximalist/hummingbird.js"
import * as controllers from "./controllers/index.js"
import "./models/index.js"

const hummingbird = new Hummingbird();

// shorter: hummingbird.get("/", "index");

let clicked = 0;

hummingbird.get("/", controllers.get);
hummingbird.post("/click", controllers.click);

await hummingbird.start();
