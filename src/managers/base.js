export default class BaseManager {

    static async find(req) {
        if (!req.session.user_id) throw new Error("No user ID provided");
        if (!req.params.id) throw new Error("No param ID provided");

        const where = Object.assign({}, this.defaultWhere, {
            where: {
                id: req.params.id,
                UserId: req.session.user_id,
            }
        });

        const obj = await this.Model.findOne(where);
        if (!obj) throw new Error("No object found");
        return obj;
    }

    static async findAll(req) {
        const UserId = req.session.user_id;
        const where = Object.assign({}, this.defaultWhere, { where: { UserId } });
        return await Model.findAll(where);
    }



}

BaseManager.Model = null;