import Envtools from "../services/Envtools.js"
import Model from "../models/model.js"

import LLM from "@themaximalist/llm.js"

import BaseManager from "./base.js"

export default class Models extends BaseManager {

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
