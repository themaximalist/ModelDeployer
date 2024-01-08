export default class BaseController {
    constructor(path) {
        this.path = path;
        this.defaultWhere = { where: { active: true } };
    }

    get route() {
        if (this.path.indexOf(`/${this.namespace}`) === 0) { return this.path }
        return `/${this.path}${this.namespace}`;
    }

    add(req, res) {
        res.render(`${this.namespace}/edit`, {
            [this.object]: this.model.build(),
            action: `${this.route}/add`,
        });
    }

    async add_handler(req, res) {
        try {
            const object = await this.manager.add(req.body);
            res.flash("success", `Successfully added ${this.object}`);
            res.redirect(`${this.route}/${object.id}/`);
        } catch (e) {
            return res.render(`${this.namespace}/edit`, { model: req.body, error: e.message, action: `${this.route}/add` });
        }
    }

    async index(req, res) {
        res.render(`${this.namespace}/index`, {
            [this.namespace]: await this.model.findAll(this.defaultWhere),
        });
    };

    async show(req, res) {
        res.render(`${this.namespace}/show`, {
            [this.object]: await this.model.findByPk(req.params.id),
        });
    }

    async edit(req, res) {
        res.render(`${this.namespace}/edit`, {
            [this.object]: await this.model.findByPk(req.params.id),
            action: `${this.route}/${req.params.id}/edit`
        });
    }

    async edit_handler(req, res) {
        try {
            const object = await this.manager.edit(req.body);
            res.flash("success", `Successfully edited ${this.object}`);
            res.redirect(`${this.route}/${object.id}/`);
        } catch (e) {
            return res.render(`${this.namespace}/edit`, { model: req.body, error: e.message, action: `${this.route}/edit` });
        }
    }

    async remove_handler(req, res) {
        const model = await this.model.findByPk(req.params.id);
        await model.update({ active: false });
        res.flash("success", `Successfully deleted ${this.object}`);
        res.redirect(`/models`);
    }

    mount(get, post) {
        // (c)reate
        get(`${this.route}/add`, this.add.bind(this));

        // (r)ead
        get(`${this.route}`, this.index.bind(this));
        get(`${this.route}/:id/`, this.show.bind(this));

        // (u)pdate
        post(`${this.route}/add`, this.add_handler.bind(this));
        get(`${this.route}/:id/edit`, this.edit.bind(this));
        post(`${this.route}/:id/edit`, this.edit_handler.bind(this));

        // (d)elete
        post(`${this.route}/:id/remove`, this.remove_handler.bind(this));
    }
}