import LLM from "@themaximalist/llm.js"
const model = "modeldeployer://bbf950a2-83c7-47e5-be66-46ca6e43f316";
const llm = new LLM([], { model, temperature: 0, max_tokens: 0 })

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
    console.log("input", input);
    const response = await llm.chat(input);
    console.log("RESPONSE", response);
    for await (const text of response) {
        console.log(text);
    }
}
