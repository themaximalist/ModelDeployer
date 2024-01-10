
const INPUT = "input";
const OUTPUT = "output";

// INPUT/OUTPUT cost per 1k tokens
const SERVICE = {
    "gpt-4-1106-preview": [0.01, 0.03],
    "gpt-4-1106-vision-preview": [0.01, 0.03],
    "gpt-4": [0.03, 0.06],
    "gpt-4-32k": [0.06, 0.12],
    "gpt-3.5-turbo-1106": "gpt-3.5-turbo",
    "gpt-3.5": "gpt-3.5-turbo",
    "gpt-3.5-turbo": [0.0010, 0.0020],
}

function getModelCost(model) {
    const service = SERVICE[model];
    if (typeof service === "string") {
        return getModelCost(service);
    }

    return service;
}

export default function TokenCost(num_tokens, model, input_type = null) {
    if (!input_type) { throw new Error("input_type is required") }
    if (input_type !== INPUT && input_type !== OUTPUT) { throw new Error("input_type must be INPUT or OUTPUT") }

    if (!model) { throw new Error("model is required") }

    const service = getModelCost(model);
    if (!service) { throw new Error("model not found") }

    const cost = (input_type === INPUT ? service[0] : service[1]);

    return (num_tokens / 1000.0) * cost;
}

TokenCost.INPUT = INPUT;
TokenCost.OUTPUT = OUTPUT;