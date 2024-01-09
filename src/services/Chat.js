import debug from "debug";
const log = debug("modeldeployer:services:chat");

import LLM from "@themaximalist/llm.js"
import Model from "../models/model.js";

export default async function Chat(req) {
    log("/api/v1/chat")
    const { messages, options } = req.body;
    const opts = await parseOptions(options);
    return await LLM(messages, opts);
}

async function parseOptions(options = {}) {
    if (LLM.serviceForModel(options.model) !== LLM.MODELDEPLOYER) { return options }

    try {
        const [_, id] = options.model.split("/");
        const model = await Model.findByPk(id);
        return { ...model.options, ...options, model: model.model };
    } catch (e) {
        throw new Error(`Could not find model ${options.model}`);
    }
}

