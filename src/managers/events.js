import BaseManager from "./base.js"
import Event from "../models/event.js"
import Model from "../models/model.js"
import TokenCounter from "../services/TokenCounter.js"

export default class Events extends BaseManager {
    constructor() {
        super(...arguments);
        this.Model = Event;
        this.Reference = Model;
    }

    async success(data = {}) {
        data.messages_tokens = TokenCounter(data.messages);
        data.response_tokens = TokenCounter(data.response_data);
        data.tokens = data.messages_tokens + data.response_tokens;
        data.response_code = 200;

        return await Event.create(data);
    }

    async failure(data = {}) {
        data.messages_tokens = TokenCounter(data.messages);
        if (!data.response_data) { data.response_data = "Unknown error" }
        data.response_tokens = 0;
        data.tokens = data.messages_tokens + data.response_tokens;
        data.response_code = 500;

        return await Event.create(data);
    }
}

