import Hummingbird from "@themaximalist/hummingbird.js"

const hummingbird = new Hummingbird();
import "./models/index.js"

// shorter: hummingbird.get("/", "index");

let clicked = 0;

hummingbird.get("/", (req, res) => {
    res.render("index", { clicked });
});

hummingbird.post("/clicked", (req, res) => {
    clicked += 1;
    res.render("partials/clicked", { clicked });
});

await hummingbird.start();