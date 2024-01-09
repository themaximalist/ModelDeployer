import User from './models/user.js';

export async function loggedInUser(req, res, next) {
    if (req.session.user_id) {
        try {
            const user = await User.findByPk(req.session.user_id);
            res.locals.user_id = user.id;
            res.locals.user_email = user.email;
            res.locals.user_admin = user.admin;
        } catch (e) {
            req.session.user_id = null;
        }
    }

    if (req.path.startsWith("/admin") && !res.locals.user_id) {
        return res.redirect("/users/login");
    }

    next();
};

export async function apiUser(req, res, next) {
    if (!req.path.startsWith("/api")) {
        return next();
    }

    let apikey = req.headers["x-api-key"] || req.query.apikey;
    if (!apikey) {
        return res.status(401).json({ error: "No API key provided" });
    }

    // req.locals.api_key = apikey;

    next();
}