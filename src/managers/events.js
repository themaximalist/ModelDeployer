import BaseManager from "./base.js"
import Event from "../models/event.js"
import Model from "../models/model.js"

export default class Events extends BaseManager {
    constructor() {
        super(...arguments);
        this.Model = Event;
        this.Reference = Model;
    }
}

