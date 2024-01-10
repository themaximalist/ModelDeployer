import TokenCost from "./services/TokenCost.js";

console.log("COST", TokenCost(5, "gpt-3.5-turbo-1106", TokenCost.INPUT));
console.log("COST", TokenCost(5, "gpt-4-1106-preview", TokenCost.INPUT));

/*
import LLM from "@themaximalist/llm.js"
const model = "modeldeployer://bbf950a2-83c7-47e5-be66-46ca6e43f316";
const llm = new LLM([], { model, temperature: 0, max_tokens: 200, stream: true })

import fs from "fs";

let stdin = fs.openSync("/dev/stdin", "rs");

const prompt = function (message) {
    fs.writeSync(process.stdout.fd, message + " ");
    let s = '';
    let buf = Buffer.alloc(1);
    fs.readSync(stdin, buf, 0, 1, null);
    while ((buf[0] != 10) && (buf[0] != 13)) {
        s += buf;
        fs.readSync(stdin, buf, 0, 1, null);
    }
    return s;
}

while (true) {
    const input = prompt("> ");
    const response = await llm.chat(input);
    for await (const text of response) {
        process.stdout.write(text);
    }
    process.stdout.write("\n");
}

*/