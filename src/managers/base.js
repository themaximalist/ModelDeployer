export default class BaseManager {

    static async find(req) {
        if (!req.session.user_id) throw new Error("No user ID provided");
        if (!req.params.id) throw new Error("No param ID provided");

        const where = JSON.parse(JSON.stringify(this.defaultWhere));
        where.where.id = req.params.id;
        where.where.UserId = req.session.user_id;

        const obj = await this.Model.findOne(where);
        if (!obj) throw new Error("No object found");
        return obj;
    }

    static async findAll(req) {
        const UserId = req.session.user_id;
        const where = JSON.parse(JSON.stringify(this.defaultWhere));
        where.where.UserId = UserId;
        return await this.Model.findAll(where);
    }

    static async edit(req) {
        if (!req.body.id) throw new Error("No ID provided");
        const model = await this.find(req);
        return await this.update(model, req);
    }

    static async add(req) {
        if (!req.session.user_id) throw new Error("No user ID provided");

        const model = this.Model.build();
        model.UserId = req.session.user_id;

        return await this.update(model, req);
    }

    static async update(model, req) {
        throw new Error("subclasses must implement update");
    }
}

BaseManager.Model = null;
BaseManager.defaultWhere = { where: { active: true } };