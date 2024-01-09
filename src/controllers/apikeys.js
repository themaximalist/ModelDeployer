import APIKey from "../models/apikey.js"
import APIKeys from "../managers/apikeys.js"

import BaseController from "./base.js";

export default class APIKeysController extends BaseController {
    constructor() {
        super(...arguments);
        this.object = "apikey";
        this.namespace = "apikeys";
        this.model = APIKey;
        this.manager = new APIKeys();
    }

    async index(req, res) {
        res.render(`${this.namespace}/index`, {
            [this.namespace]: await this.manager.findAllKeyUsage(req.session.user_id),
        });
    };
}