import Model from "../models/model.js"
import Models from "../managers/models.js"
// import LLM from "@themaximalist/llm.js"

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
        res.redirect(`/models/${model.id}/`);
        res.send();
    } catch (e) {
        return res.render("models/new", { model: req.body, error: e.message, action: "/models/new" });
    }
}

// TODO: flash

/*
export async function update(req, res) {
    const data = req.body;

    const model = Model.build();

    try {
        model.model = data.model;
        model.secrets = res.locals.Envtools.toJSON(data.secrets);
        model.options = res.locals.Envtools.toJSON(data.options);
        model.service = LLM.serviceForModel(model.model);
        await model.save();
        res.redirect(`/models/${model.id}/?success=Successfully added new model`);
    } catch (e) {
        console.log(e);
        res.render("models/new", { model, error: "Error while saving, please try again" });
    }
};


export async function remove(req, res) {
    const model = await Model.findByPk(req.params.id);
    await model.update({ active: false });
    res.redirect(`/models?success=Successfully deleted model`);
};
*/