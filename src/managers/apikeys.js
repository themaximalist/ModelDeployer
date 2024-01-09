import { Sequelize } from "sequelize";
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

        // TODO: slow...make this in sql
        const keys = await this.Model.findAll(where);
        for (const key of keys) {
            key.usage = await key.countEvents();
        }

        return keys;
    }


}