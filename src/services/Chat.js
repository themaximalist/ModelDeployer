import debug from "debug";
const log = debug("modeldeployer:services:chat");

import LLM from "@themaximalist/llm.js"
import Model from "../models/model.js";

export default async function Chat(req) {
    log("/api/v1/chat")
    const { messages } = req.body;
    const options = await parseOptions(req);
    return await LLM(messages, options);
}

async function parseOptions(req) {
    const { options } = req.body;

    // API key overrides local model...but if they pass one we still verify
    try {
        if (req.session.apikey) {
            const model = await Model.findByPk(req.session.apikey_model_id);
            if (options.model) {
                const [_, id] = options.model.split("/");
                if (id !== model.id) {
                    throw new Error(`Invalid model ${options.model}`);
                }
            }

            return { ...model.options, model: model.model };
        }
    } catch (e) {
        throw new Error(`Could not find model ${options.model}`);
    }

    try {
        if (LLM.serviceForModel(options.model) !== LLM.MODELDEPLOYER) { return options }

        const [_, id] = options.model.split("/");
        const model = await Model.findByPk(id);
        return { ...model.options, ...options, model: model.model };
    } catch (e) {
        console.log(e);
        throw new Error(`Could not find model ${options.model}`);
    }
}

