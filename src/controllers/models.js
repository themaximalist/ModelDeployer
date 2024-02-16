import Model from "../models/model.js"
import Models from "../managers/models.js"
import Event from "../models/event.js"

import BaseController from "./base.js";

export default class ModelsController extends BaseController {
    constructor() {
        super(...arguments);
        this.object = "model";
        this.namespace = "models";
        this.model = Model;
        this.manager = new Models();
    }

    async index(req, res) {
        const where = {
            include: { model: Event }
        }
        res.render(`${this.namespace}/index`, {
            [this.namespace]: await this.manager.findAll(req.session.user_id, where),
        });
    };

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