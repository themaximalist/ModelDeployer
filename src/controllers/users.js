import User from "../models/user.js"
import Users from "../managers/users.js"

import BaseController from "./base.js";

export default class UserController extends BaseController {
    constructor() {
        super(...arguments);
        this.object = "user";
        this.namespace = "users";
        this.model = User;
        this.manager = Users;

        this.redirects["add"] = `${this.route}/profile`;
    }

    async add_handler(req, res) {
        try {
            const object = await this.manager.add(req.body);
            req.session.user_id = object.id;
            res.flash("success", `Successfully added ${this.object}`);
            res.redirect(this.redirects.add || `${this.route}/${object.id}/`);
        } catch (e) {
            return res.render(`${this.namespace}/edit`, {
                [this.object]: req.body,
                error: e.message,
                action: `${this.route}/add`
            });
        }
    }

    async profile(req, res) {
        if (!req.session.user_id) {
            return res.redirect(`${this.route}/login`);
        }

        res.render(`${this.namespace}/profile`, {
            [this.object]: await this.model.findByPk(req.params.id),
        });
    }

    async login(req, res) {
        res.render(`${this.namespace}/login`, {
            [this.object]: this.model.build(),
            action: `${this.route}/login`,
        });
    };

    async logout(req, res) {
        req.session.destroy();
        res.redirect("/");
    };

    async login_handler(req, res) {
        try {
            const object = await this.manager.login(req.body);
            req.session.user_id = object.id;
            res.flash("success", `Successfully logged in`);
            res.redirect(this.redirects.login || `${this.route}/profile`);
        } catch (e) {
            res.render(`${this.namespace}/login`, {
                [this.object]: this.model.build(req.body),
                error: e.message,
                action: `${this.route}/login`,
            });
        }
    }

    mount(get, post) {
        get(`${this.route}/signup`, this.add.bind(this));
        post(`${this.route}/signup`, this.add_handler.bind(this));

        get(`${this.route}/login`, this.login.bind(this));
        post(`${this.route}/login`, this.login_handler.bind(this));
        get(`${this.route}/logout`, this.logout.bind(this));

        get(`${this.route}/profile`, this.profile.bind(this));
    }
}