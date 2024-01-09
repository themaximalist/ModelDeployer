import lodash from "lodash";

export default class BaseManager {

    constructor() {
        this.Model = null;
        this.Reference = null; // defaults to UserId
        this.defaultWhere = { where: { active: true } };
    }

    async find(id, UserId) {
        if (!id) throw new Error("No param ID provided");
        if (!UserId) throw new Error("No user ID provided");

        const where = JSON.parse(JSON.stringify(this.defaultWhere));
        where.where.id = id;
        if (this.Reference) {
            where.include = { model: this.Reference, where: { UserId } };
        } else {
            where.where.UserId = UserId;
        }

        const obj = await this.Model.findOne(where);
        if (!obj) throw new Error("No object found");
        return obj;
    }

    async findAll(UserId, options = {}) {
        let where = JSON.parse(JSON.stringify(this.defaultWhere));
        if (this.Reference) {
            where.include = { model: this.Reference, where: { UserId } };
        } else {
            where.where.UserId = UserId;
        }

        where = lodash.merge(where, options);

        return await this.Model.findAll(where);
    }

    async edit(data, UserId) {
        if (!data.id) throw new Error("No ID provided");
        const model = await this.find(data.id, UserId);
        return await this.update(model, data);
    }

    async add(data, UserId) {
        if (!UserId) throw new Error("No user ID provided");

        const model = this.Model.build();
        model.UserId = UserId;

        return await this.update(model, data);
    }

    static async update(model, req) {
        throw new Error("subclasses must implement update");
    }
}
