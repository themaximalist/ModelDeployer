import BaseManager from "./base.js"
import Model from "../models/model.js"

import Envtools from "../services/Envtools.js"
import LLM from "@themaximalist/llm.js"

export default class Models extends BaseManager {

    constructor() {
        super(...arguments);
        this.Model = Model;
    }

    async update(model, req) {
        const data = req.body;
        model.model = data.model;
        model.secrets = Envtools.toJSON(data.secrets);
        model.options = Envtools.toJSON(data.options);
        model.service = LLM.serviceForModel(model.model);
        return await model.save();
    }
}
