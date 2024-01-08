let clicked = 0;

export function get(req, res) {
    res.render("index", { clicked });
}

export function click(req, res) {
    clicked += 1;
    res.render("partials/clicked", { clicked });
}