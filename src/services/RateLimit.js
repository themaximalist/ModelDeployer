import debug from "debug"
const log = debug("modeldeployer:RateLimit");

import { Op } from "sequelize";
import Model from "../models/model.js"
import Event from "../models/event.js"
import APIKey from "../models/apikey.js";

function parsePeriod(period) {
    if (period == "second") return 1;
    if (period == "minute") return 60;
    if (period == "hour") return 3600;
    if (period == "day") return 86400;
    if (period == "week") return 604800;
    if (period == "month") return 2628000;
    if (period == "year") return 31536000;
    return 0;
}

export default async function RateLimit(model, apikey) {
    if (typeof model.options.ratelimit_tokens === "undefined") return false;
    if (typeof model.options.ratelimit_period === "undefined") return false;

    const allowed_tokens = Number(model.options.ratelimit_tokens);
    if (allowed_tokens === 0) return true;

    const period = parsePeriod(model.options.ratelimit_period);
    if (!period) return true;

    const events = await Event.findAll({
        where: {
            APIKeyId: apikey,
            createdAt: {
                [Op.gte]: new Date(Date.now() - period * 1000),
            }
        }
    });

    if (events.length === 0) return false;

    const used_tokens = events.reduce((acc, event) => {
        return acc + event.tokens;
    }, 0);

    if (used_tokens < allowed_tokens) return false;

    log(`RateLimit ${apikey} used ${used_tokens} of ${allowed_tokens} tokens in the last ${period} seconds`);

    return true;
}