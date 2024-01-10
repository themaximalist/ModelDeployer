import LLM from "@themaximalist/llm.js"
//const model = "modeldeployer://bbf950a2-83c7-47e5-be66-46ca6e43f316"; // gpt-4
//const model = "modeldeployer://a52f2bfb-10c2-4d54-bb97-eb82fdaecc8d"; // anthropic
const model = "modeldeployer://8dad4c6b-0b1b-4ce7-9c72-3ea35d48fd46"; // llama
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
