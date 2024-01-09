import LLM from "@themaximalist/llm.js"
const model = "modeldeployer://bbf950a2-83c7-47e5-be66-46ca6e43f316";
const llm = new LLM([], { model, temperature: 0, max_tokens: 100 })

console.log(await llm.chat('the color of the sky is usually'));
