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

    async show(req, res) {
        try {
            res.render(`${this.namespace}/show`, {
                [this.object]: await this.manager.findKeyUsage(req.params.id, req.session.user_id),
            });
        } catch (e) {
            res.flash("error", "Cannot find model");
            res.render(`error`);
        }
    }
}