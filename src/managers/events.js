import BaseManager from "./base.js"
import Event from "../models/event.js"
import Model from "../models/model.js"

export default class Events extends BaseManager {

    // TODO: figure out how to integrate these back to base (they're related filters)
    static async find(req) {
        const UserId = req.session.user_id;

        if (!UserId) throw new Error("No user ID provided");
        if (!req.params.id) throw new Error("No param ID provided");

        const where = JSON.parse(JSON.stringify(this.defaultWhere));
        where.where.id = req.params.id;
        where.include = { model: Model, where: { UserId } };

        const obj = await this.Model.findOne(where);
        if (!obj) throw new Error("No object found");
        return obj;
    }

    static async findAll(req) {
        const UserId = req.session.user_id;
        const where = JSON.parse(JSON.stringify(this.defaultWhere));
        where.include = { model: Model, where: { UserId } };
        return await this.Model.findAll(where);
    }

    static async update(model, req) {
        const data = req.body;
        console.log("MODEL", model, data);
        throw "BLAMO";
        // return await model.save();
    }
}

Events.Model = Event;
