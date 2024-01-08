import Envtools from "../services/Envtools.js";
import Model from "../models/model.js";

import LLM from "@themaximalist/llm.js";

class Manager {
}

export default class Models extends Manager {
    static async create(data) {
        const model = Model.build();
        model.model = data.model;
        model.secrets = Envtools.toJSON(data.secrets);
        model.options = Envtools.toJSON(data.options);
        model.service = LLM.serviceForModel(model.model);
        return await model.save();
    }
}
