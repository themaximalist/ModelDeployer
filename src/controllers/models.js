import Model from "../models/model.js"
import Models from "../managers/models.js"

export async function index(req, res) {
    const models = await Model.findAll({ where: { active: true } });
    res.render("models/index", { models });
};

export async function show(req, res) {
    const model = await Model.findByPk(req.params.id);
    res.render("models/show", { model });
}

export async function edit(req, res) {
    const model = Model.build();
    res.render("models/new", { model });
};

export async function update(req, res) {
    try {
        const model = await Models.create(req.body);
        res.redirect(`/models/${model.id}/?success=Successfully created model`);
    } catch (e) {
        return res.render("models/new", { model: req.body, error: e.message, action: "/models/new" });
    }
}
export async function remove(req, res) {
    const model = await Model.findByPk(req.params.id);
    await model.update({ active: false });
    res.redirect(`/models?success=Successfully deleted model`);
};