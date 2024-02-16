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
        let offset = req.query.offset || 0;
        let limit = req.query.limit || 100;
        if (offset < 0) offset = 0;
        if (limit < 0) limit = 100;
        if (limit > 500) limit = 500;

        if (apikey) { options.where = { APIKeyId: apikey } }
        if (model) { options.where = { ModelId: model } }

        options.order = [['createdAt', 'DESC']];
        options.offset = offset;
        options.limit = limit;

        const { rows, count } = await this.manager.findAndCountAll(req.session.user_id, options);

        res.render(`${this.namespace}/index`, {
            apikey,
            model,
            [this.namespace]: rows,
            limit,
            offset,
            count,
        });
    };
}