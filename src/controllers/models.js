import Model from "../models/model.js"
import Models from "../managers/models.js"

import BaseController from "./base.js";

export default class ModelsController extends BaseController {
    constructor(path) {
        super(...arguments);
        this.object = "model";
        this.namespace = "models";
        this.model = Model;
        this.manager = Models;
        this.defaultWhere = { where: { active: true } };
    }

}


/*
// (C)REATE
if (controllers.add) {
}

if (controllers.index) {
}

//    this.get(`${path}/:id/edit`, controllers.edit);

if (controllers.update) {
 this.post(`${path}/add`, controllers.update);
}

if (controllers.show) {
 this.get(`${path}/:id`, controllers.show);
}

if (controllers.remove) {
 this.post(`${path}/:id/remove`, controllers.remove);
}
*/

/*
export async function add(req, res) {
    const model = Model.build();
    res.render("models/edit", { model, action: "/models/add" });
};
*/

/*

// CREATE

// READ
// UPDATE
export async function edit(req, res) {
    const { id } = req.params;

    if (id) {
        const model = await Model.findByPk(id);
        res.render("models/edit", { model, action: `/models/${id}/edit` });
    } else {
        const model = Model.build();
        res.render("models/edit", { model, action: `/models/${id}/edit` });
    }

};

export async function update(req, res) {
    try {
        const model = await Models.create(req.body);
        res.redirect(`/models/${model.id}/?success=Successfully created model`);
    } catch (e) {
        return res.render("models/new", { model: req.body, error: e.message, action: "/models/new" });
    }
}

// DELETE
export async function remove(req, res) {
    const model = await Model.findByPk(req.params.id);
    await model.update({ active: false });
    res.redirect(`/models?success=Successfully deleted model`);
};
*/