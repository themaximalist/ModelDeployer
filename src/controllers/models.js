import Model from "../models/model.js"
import Models from "../managers/models.js"

import BaseController from "./base.js";

export default class ModelsController extends BaseController {
    constructor() {
        super(...arguments);
        this.object = "model";
        this.namespace = "models";
        this.model = Model;
        this.manager = new Models();
    }

    async show(req, res) {
        try {
            const obj = await this.manager.find(req.params.id, req.session.user_id);
            obj.apikeys = await obj.getAPIKeys({ where: { active: true } });
            res.render(`${this.namespace}/show`, {
                [this.object]: obj
            });
        } catch (e) {
            res.flash("error", "Cannot find model");
            res.render(`error`);
        }
    }
}