import BaseManager from "./base.js"
import Event from "../models/event.js"
import Model from "../models/model.js"

export default class Events extends BaseManager {
    constructor() {
        super(...arguments);
        this.Model = Event;
        this.Reference = Model;
    }

    async update(model, req) {
        const data = req.body;
        console.log("MODEL", model, data);
        throw "BLAMO";
        // return await model.save();
    }
}

