import Envtools from "../services/Envtools.js";
import Model from "../models/model.js";

import LLM from "@themaximalist/llm.js";

class Manager {
}

export default class Models extends Manager {
    static async edit(data) {
        if (!data.id) throw new Error("No ID provided");

        const model = await Model.findByPk(data.id);
        return await Models.update(model, data);
    }

    static async add(data) {
        const model = Model.build();
        return await Models.update(model, data);
    }

    static async update(model, data) {
        model.model = data.model;
        model.secrets = Envtools.toJSON(data.secrets);
        model.options = Envtools.toJSON(data.options);
        model.service = LLM.serviceForModel(model.model);
        return await model.save();
    }
}
