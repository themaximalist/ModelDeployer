import BaseManager from "./base.js"
import APIKey from "../models/model.js"

export default class APIKeys extends BaseManager {

    static async update(model, req) {
        const data = req.body;
        model.options = data.options;
        return await model.save();
    }
}

APIKeys.Model = APIKey;
