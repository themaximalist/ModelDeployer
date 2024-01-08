export default class BaseController {
    constructor(path) {
        this.path = path;
        this.defaultWhere = {};
    }

    get route() {
        if (this.path.indexOf(`/${this.namespace}`) === 0) { return this.path }
        return `/${this.path}${this.namespace}`;
    }

    add(req, res) {
        res.render(`${this.namespace}/edit`, {
            [this.object]: this.model.build(),
            action: `/${this.namespace}/new`,
        });
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


    mount(get, post) {
        // (c)reate
        get(`${this.route}/add`, this.add.bind(this));

        // (r)ead
        get(`${this.route}`, this.index.bind(this));
        get(`${this.route}/:id/`, this.show.bind(this));

        // (u)pdate

        // (d)elete
    }
}