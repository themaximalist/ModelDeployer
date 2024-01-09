import BaseManager from "./base.js"
import APIKey from "../models/apikey.js"
import Model from "../models/model.js"

export default class APIKeys extends BaseManager {

    constructor() {
        super(...arguments);
        this.Model = APIKey;
        this.Reference = Model;
    }

    async update(model, req) {
        const data = req.body;
        model.ModelId = data.ModelId;
        model.options = data.options;
        return await model.save();
    }
}