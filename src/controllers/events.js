import Event from "../models/event.js"
import Events from "../managers/events.js"

import BaseController from "./base.js";

export default class EventsController extends BaseController {
    constructor() {
        super(...arguments);
        this.object = "event";
        this.namespace = "events";
        this.model = Event;
        this.manager = new Events();
    }

    async index(req, res) {
        const options = {};
        const { apikey, model } = req.query;
        if (apikey) { options.where = { APIKeyId: apikey } }
        if (model) { options.where = { ModelId: model } }
        options.order = [['createdAt', 'DESC']];

        res.render(`${this.namespace}/index`, {
            apikey,
            model,
            [this.namespace]: await this.manager.findAll(req.session.user_id, options),
        });
    };
}