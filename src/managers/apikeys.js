import lodash from "lodash";

import BaseManager from "./base.js"
import APIKey from "../models/apikey.js"
import Model from "../models/model.js"

export default class APIKeys extends BaseManager {

    constructor() {
        super(...arguments);
        this.Model = APIKey;
        this.Reference = Model;
    }

    async update(model, data) {
        model.ModelId = data.ModelId;
        model.options = data.options;
        return await model.save();
    }

    async findKeyUsage(id, UserId) {
        const key = await this.find(id, UserId);
        return await this.addUsage(key);
    }

    async findAllKeyUsage(UserId, options = {}) {
        let where = JSON.parse(JSON.stringify(this.defaultWhere));
        if (this.Reference) {
            where.include = [
                { model: this.Reference, where: { UserId } },
            ];
        } else {
            where.where.UserId = UserId;
        }

        where = lodash.merge(where, options);

        const keys = await this.findAll(UserId, where);
        return await Promise.all(keys.map(async (key) => await this.addUsage(key)));
    }

    // TODO: move to sql...not scalable
    async addUsage(key) {
        let tokens = 0;
        let cost = 0;
        const events = await key.getEvents();
        for (const event of events) {
            cost += Number(event.cost);
            tokens += event.tokens
        }

        key.cost = cost;
        key.tokens = tokens;

        return key;
    }
}