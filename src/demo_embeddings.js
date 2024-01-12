import "dotenv-extended/config.js";

import Embeddings from "@themaximalist/embeddings.js"
const service = "modeldeployer";
const model = "7cd96f49-9653-4d03-b47d-65bcee807e71";

const options = { service, model, apikey: process.env.MODELDEPLOYER_OPENAI_API_KEY };

const response = await Embeddings("hello world this is a longer embedding request that I am trying to see how usage is working", options);
console.log(response);
