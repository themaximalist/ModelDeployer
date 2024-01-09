import Envtools from "../services/Envtools.js"
import Model from "../models/model.js"

import LLM from "@themaximalist/llm.js"

import BaseManager from "./base.js"

// TODO: how to break some of this out?

export default class Models extends BaseManager {

    static async findAll(req) {
        const UserId = req.session.user_id;
        const where = Object.assign({}, this.defaultWhere, { where: { UserId } });
        return await Model.findAll(where);
    }

    static async edit(req) {
        if (!req.body.id) throw new Error("No ID provided");
        const model = await Models.find(req);
        return await Models.update(model, req);
    }

    static async add(req) {
        if (!req.session.user_id) throw new Error("No user ID provided");

        const model = Model.build();
        model.UserId = req.session.user_id;

        return await Models.update(model, req);
    }

    static async update(model, req) {
        const data = req.body;
        model.model = data.model;
        model.secrets = Envtools.toJSON(data.secrets);
        model.options = Envtools.toJSON(data.options);
        model.service = LLM.serviceForModel(model.model);
        return await model.save();
    }
}

Models["Model"] = Model;
