import debug from "debug";
const log = debug("modeldeployer:services:chat");

import LLM from "@themaximalist/llm.js"
import Model from "../models/model.js";

export default async function Chat({ messages, options }, apikey_model_id = null) {
    log("/api/v1/chat")
    return await LLM(
        messages,
        await parseOptions(options, apikey_model_id)
    );
}

async function parseOptions(options, apikey_model_id = null) {
    if (!apikey_model_id) { throw new Error("No model ID provided") }

    const model = await Model.findByPk(apikey_model_id);
    if (!model) throw new Error(`Invalid model ${apikey_model_id}`);

    return { ...model.options, ...options, model: model.model };
}

