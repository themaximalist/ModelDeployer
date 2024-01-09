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
}