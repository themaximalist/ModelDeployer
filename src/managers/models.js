import BaseManager from "./base.js"
import Model from "../models/model.js"

import Envtools from "../services/Envtools.js"
import LLM from "@themaximalist/llm.js"

function serviceForModel(model) {
    const service = LLM.serviceForModel(model);
    if (service) { return service }

    if (model === "text-embedding-local") {
        return "local";
    } else if (model.indexOf("text-embedding-ada-") === 0) {
        return "openai";
    }

    return null;
}

export default class Models extends BaseManager {

    constructor() {
        super(...arguments);
        this.Model = Model;
    }

    async update(model, data) {
        model.model = data.model;
        model.options = Envtools.toJSON(data.options);
        model.service = serviceForModel(model.model);
        return await model.save();
    }
}
