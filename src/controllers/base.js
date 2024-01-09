export default class BaseController {
    constructor(path) {
        this.path = path;
        this.defaultWhere = { where: { active: true } };
        this.redirects = {};
    }

    get route() {
        if (this.path.indexOf(`/${this.namespace}`) === 0) { return this.path }
        return `${this.path}/${this.namespace}`;
    }

    add(req, res) {
        res.render(`${this.namespace}/edit`, {
            [this.object]: this.model.build(),
            action: `${this.route}/add`,
        });
    }

    async add_handler(req, res) {
        try {
            const object = await this.manager.add(req.body, req.session.user_id);
            res.flash("success", `Successfully added ${this.object}`);
            res.redirect(this.redirects.add || `${this.route}/${object.id}/`);
        } catch (e) {
            console.log(e);
            return res.render(`${this.namespace}/edit`, {
                [this.object]: req.body,
                error: e.message,
                action: `${this.route}/add`
            });
        }
    }

    async index(req, res) {
        res.render(`${this.namespace}/index`, {
            [this.namespace]: await this.manager.findAll(req.session.user_id),
        });
    };

    async show(req, res) {
        try {
            res.render(`${this.namespace}/show`, {
                [this.object]: await this.manager.find(req.params.id, req.session.user_id),
            });
        } catch (e) {
            res.flash("error", "Cannot find model");
            res.render(`error`);
        }
    }

    async edit(req, res) {
        try {
            res.render(`${this.namespace}/edit`, {
                [this.object]: await this.manager.find(req.params.id, req.session.user_id),
                action: `${this.route}/${req.params.id}/edit`
            });
        } catch (e) {
            res.flash("error", "Cannot find model");
            res.render(`error`);
        }
    }

    async edit_handler(req, res) {
        try {
            const object = await this.manager.edit(req.body, req.session.user_id);
            res.flash("success", `Successfully edited ${this.object}`);
            res.redirect(`${this.route}/${object.id}/`);
        } catch (e) {
            return res.render(`${this.namespace}/edit`, {
                [this.object]: req.body,
                error: e.message,
                action: `${this.route}/${req.params.id}/edit`
            });
        }
    }

    async remove_handler(req, res) {
        const obj = await this.manager.find(req.params.id, req.session.user_id);
        await obj.update({ active: false });
        res.flash("success", `Successfully deleted ${this.object}`);
        res.redirect(this.route);
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