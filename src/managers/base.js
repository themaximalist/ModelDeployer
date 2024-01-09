export default class BaseManager {

    constructor() {
        this.Model = null;
        this.Reference = null; // defaults to UserId
        this.defaultWhere = { where: { active: true } };
    }

    async find(req) {
        const UserId = req.session.user_id;

        if (!UserId) throw new Error("No user ID provided");
        if (!req.params.id) throw new Error("No param ID provided");

        const where = JSON.parse(JSON.stringify(this.defaultWhere));
        where.where.id = req.params.id;
        if (this.Reference) {
            where.include = { model: this.Reference, where: { UserId } };
        } else {
            where.where.UserId = req.session.user_id;
        }

        const obj = await this.Model.findOne(where);
        if (!obj) throw new Error("No object found");
        return obj;
    }

    async findAll(req) {
        const UserId = req.session.user_id;
        const where = JSON.parse(JSON.stringify(this.defaultWhere));
        if (this.Reference) {
            where.include = { model: this.Reference, where: { UserId } };
        } else {
            where.where.UserId = UserId;
        }
        return await this.Model.findAll(where);
    }

    async edit(req) {
        if (!req.body.id) throw new Error("No ID provided");
        const model = await this.find(req);
        return await this.update(model, req);
    }

    async add(req) {
        if (!req.session.user_id) throw new Error("No user ID provided");

        const model = this.Model.build();
        model.UserId = req.session.user_id;

        return await this.update(model, req);
    }

    static async update(model, req) {
        throw new Error("subclasses must implement update");
    }
}
