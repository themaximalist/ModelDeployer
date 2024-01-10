import debug from "debug";
const log = debug("modeldeployer:TokenCounter");

import { getEncoding, getEncodingNameForModel } from "js-tiktoken";

const MODEL = "gpt-3.5-turbo";

export default function TokenCounter(input, model = MODEL) {

    if (Array.isArray(input)) {
        input = input.map(message => message.content).join(" ");
    }

    if (typeof input !== "string") { throw new Error("Input must be a string") }

    let encoding;

    try {
        encoding = getEncodingNameForModel(model);
    } catch (e) {
        log(`Falling back from model ${model} to ${MODEL}`)
        encoding = getEncodingNameForModel(MODEL);
    }

    const encoder = getEncoding(encoding);
    return encoder.encode(input).length;
}