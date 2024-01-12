import BaseManager from "./base.js"
import Event from "../models/event.js"
import Model from "../models/model.js"
import TokenCounter from "../services/TokenCounter.js"
import TokenCost from "../services/TokenCost.js"

export default class Events extends BaseManager {
    constructor() {
        super(...arguments);
        this.Model = Event;
        this.Reference = Model;
    }

    async success(data = {}, options = {}) {
        if (typeof options.count_response_tokens === "undefined") { options.count_response_tokens = true }

        data.messages_tokens = TokenCounter(data.messages);

        if (options.count_response_tokens) {
            data.response_tokens = TokenCounter(data.response_data);
        } else {
            data.response_tokens = 0;
        }

        data.tokens = data.messages_tokens + data.response_tokens;

        let model_or_costs = data.model;
        delete data.model;

        if (typeof data.options.input_cost !== "undefined" && data.options.output_cost !== "undefined") {
            model_or_costs = { input: data.options.input_cost, output: data.options.output_cost };
        }

        data.messages_cost = TokenCost(data.messages_tokens, model_or_costs, TokenCost.INPUT);
        data.response_cost = TokenCost(data.response_tokens, model_or_costs, TokenCost.OUTPUT);
        data.cost = data.messages_cost + data.response_cost;

        data.response_code = 200;

        return await Event.create(data);
    }

    async failure(data = {}) {
        data.messages_tokens = TokenCounter(data.messages);
        if (!data.response_data) { data.response_data = "Unknown error" }
        data.response_tokens = 0;
        data.tokens = data.messages_tokens + data.response_tokens;
        data.response_code = 500;

        let model_or_costs = data.model;
        delete data.model;

        if (typeof data.options.input_cost !== "undefined" && data.options.output_cost !== "undefined") {
            model_or_costs = { input: data.options.input_cost, output: data.options.output_cost };
        }

        data.messages_cost = TokenCost(data.messages_tokens, model_or_costs, TokenCost.INPUT);
        data.response_cost = 0;
        data.cost = data.messages_cost + data.response_cost;

        delete data.model;
        return await Event.create(data);
    }
}

