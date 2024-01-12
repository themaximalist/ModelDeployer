import User from "./models/user.js"
import APIKey from "./models/apikey.js"

import { timeSince, smartRound } from "./utils.js";

export async function helpers(req, res, next) {
    req.app.locals.timeSince = timeSince;
    req.app.locals.smartRound = smartRound;
    next();
}

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
    let key = req.headers["x-api-key"] || req.query.apikey;

    if (!key) {
        return res.status(401).json({ error: "No API key provided" });
    }

    try {
        const apikey = await APIKey.findOne({ where: { id: key } });
        if (!apikey) {
            return res.status(401).json({ error: "Invalid API key provided" });
        }

        req.session.apikey = apikey.id;
        req.session.apikey_model_id = apikey.ModelId;

        next();
    } catch (e) {
        console.log(e);
        return res.status(401).json({ error: "Invalid API key provided" });
    }
}