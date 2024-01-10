import assert from "assert";
import LLM from "@themaximalist/llm.js"
import Event from "../src/models/event.js"
import { setupDatabase, teardownDatabase } from "./utils.js";
import TokenCounter from "../src/services/TokenCounter.js";
import TokenCost from "../src/services/TokenCost.js";

// largely a duplicate of the other three modules, this works with modeldeployer which in turn works with llm.js

describe("modeldeployer", function () {
    this.timeout(10000);
    this.slow(5000);

    let models = {};

    this.beforeAll(async function () {
        models = await setupDatabase();
    });

    this.afterAll(async function () {
        await teardownDatabase(true);
    });

    // TODO: tests llamafile model with override costs

    describe("modeldeployer llamafile", function () {
        let model;
        this.beforeAll(() => { model = models.llama });

        it.only("prompt (with cost override)", async function () {
            // cost override for llama is set in test/utils.js
            const response = await LLM("the color of the sky is usually", { model });
            assert(response.indexOf("blue") !== -1, response);

            const event = await Event.findOne({ order: [["createdAt", "DESC"]] });
            assert(event.response_data.indexOf("blue") !== -1, event.response_data);
            assert(event.cost > 0);
            assert(event.tokens > 0);
        });

        /*
        it("prompt (max_token override)", async function () {
            const response = await LLM("the color of the sky is usually", { model, max_tokens: 1 });
            assert(response.length > 0);
            assert(response.length < 6);
        });
        */
    });


    describe("modeldeployer gpt-3.5-turbo", async function () {
        let model;
        this.beforeAll(() => { model = models.gpt });

        it("prompt", async function () {
            console.log("MODELS1", model);

            const response = await LLM("the color of the sky is usually", { model });
            assert(response.indexOf("blue") !== -1, response);
        });

        it("invalid api key", async function () {
            try {
                const response = await LLM("the color of the sky is usually", { model: "modeldeployer://abc" });
                assert.fail("should have thrown error");
            } catch (e) {
                assert.ok("ok");
            }
        });

        it("prompt (max_token override)", async function () {
            const response = await LLM("the color of the sky is usually", { model, max_tokens: 1 });
            assert(response.indexOf("blue") !== -1, response);
            assert(response.length > 0);
            assert(response.length < 6);
        });


        it("streaming", async function () {
            const llm = new LLM([], { stream: true, model });
            const response = await llm.chat("who created hypertext?");

            let buffer = "";
            for await (const content of response) {
                buffer += content;
            }

            assert(buffer.includes("Ted Nelson"));
        });
    });

    describe("modeldeployer claude", function () {
        let model;
        this.beforeAll(() => { model = models.claude });

        it("prompt", async function () {
            const response = await LLM("the color of the sky is usually", { model });
            assert(response.indexOf("blue") !== -1, response);

            const event = await Event.findOne({ order: [["createdAt", "DESC"]] });
            assert(event.response_data.indexOf("blue") !== -1, event.response_data);
            assert(event.cost > 0);
            assert(event.tokens > 0);
        });

        it("prompt (max_token override)", async function () {
            const response = await LLM("the color of the sky is usually", { model, max_tokens: 1 });
            assert(response.length > 0);
            assert(response.length < 6);
        });
    });



    describe("token cost", function () {
        it("calculates token cost for gpt 3.5 turbo", async function () {
            const model = "gpt-3.5-turbo-1106";
            const tokens = TokenCounter("the color of the sky is usually blue", model);
            assert.equal(tokens, 8);

            const cost = TokenCost(tokens, model, TokenCost.INPUT);
            assert.equal(cost, 0.000008)
        });

        it("calculates token cost for gpt 4", async function () {
            const model = "gpt-4";
            const tokens = TokenCounter("the color of the sky is usually blue", model);
            assert.equal(tokens, 8);

            const cost = TokenCost(tokens, model, TokenCost.INPUT);
            assert.equal(cost, 0.00024)
        });

        it("calculates token cost for gpt 4 turbo", async function () {
            const model = "gpt-4-1106-preview";
            const tokens = TokenCounter("the color of the sky is usually blue", model);
            assert.equal(tokens, 8);

            const cost = TokenCost(tokens, model, TokenCost.INPUT);
            assert.equal(cost, 0.00008)
        });

        it("calculates token cost for claude instant", async function () {
            const model = "claude-instant-1.2";
            const tokens = TokenCounter("the color of the sky is usually blue", model);
            assert.equal(tokens, 8);

            const cost = TokenCost(tokens, model, TokenCost.INPUT);
            assert(cost >= 0.0000064);
            assert(cost < 0.00000641);
        });

        it("calculates token cost for claude 2.1", async function () {
            const model = "claude-2.1";
            const tokens = TokenCounter("the color of the sky is usually blue", model);
            assert.equal(tokens, 8);

            const cost = TokenCost(tokens, model, TokenCost.INPUT);
            assert(cost >= 0.000064, cost);
            assert(cost < 0.0000641, cost);
        });

        it("calculates llamafile override prices", async function () {
            const price = { input: 0.0001, output: 0.0001 };

            const tokens = TokenCounter("the color of the sky is usually blue", model);
            assert.equal(tokens, 8);

            const cost = TokenCost(tokens, price, TokenCost.INPUT);
            console.log(cost);
            assert(cost >= 0.0000008, cost);
            assert(cost < 0.00000081, cost);
        });
    });

    describe("events", function () {
        it("saves request as event", async function () {
            let oldEvents = await Event.findAll({});

            const response = await LLM("the color of the sky is usually", { model });
            assert(response.indexOf("blue") !== -1, response);

            let newEvents = await Event.findAll({});
            assert(oldEvents.length + 1 === newEvents.length);

            const event = await Event.findOne({ order: [["createdAt", "DESC"]] });
            assert(event);
            assert(event.messages.length == 1);
            assert(event.response_data.indexOf("blue") !== -1, event.response_data);
            assert(event.response_code === 200);
        });

        it("event saves streaming response", async function () {
            let oldEvents = await Event.findAll({});

            const llm = new LLM([], { stream: true, model });
            const response = await llm.chat("who created hypertext?");

            let buffer = "";
            for await (const content of response) {
                buffer += content;
            }

            assert(buffer.includes("Ted Nelson"));

            let newEvents = await Event.findAll({});
            assert(oldEvents.length + 1 === newEvents.length);

            const event = await Event.findOne({ order: [["createdAt", "DESC"]] });
            assert(event);
            assert(event.messages.length == 1);
            assert(event.response_data.indexOf("Ted Nelson") !== -1, event.response_data);
            assert(event.response_code === 200);
        });

        it("saves failed request as event", async function () {
            let oldEvents = await Event.findAll({});

            try {
                await LLM("the color of the sky is usually", { model, max_tokens: -1 }); // should throw error, max_tokens must be > 0
                assert.fail("should have thrown error");
            } catch (e) {
                assert.ok("ok");
            }

            let newEvents = await Event.findAll({});
            assert(oldEvents.length + 1 === newEvents.length);

            const event = await Event.findOne({ order: [["createdAt", "DESC"]] });
            assert(event);
            assert(event.messages.length == 1);
            assert(event.response_data.includes("Error"));
            assert(event.response_data.includes("max_tokens"));
            assert.notEqual(event.response_code, 200);
        });

        it("token count", async function () {
            const response = await LLM("the color of the sky is usually", { model });
            assert(response.indexOf("blue") !== -1, response);

            const event = await Event.findOne({ order: [["createdAt", "DESC"]] });
            assert(event);
            assert(event.messages.length == 1);
            assert(event.response_data.includes("blue"));
            assert(event.messages_tokens > 0);
            assert(event.response_tokens > 0);
            assert.equal(event.tokens, event.messages_tokens + event.response_tokens);
        });


        it("token price", async function () {
            let oldEvents = await Event.findAll({});

            const response = await LLM("the color of the sky is usually", { model, max_tokens: 100 });
            assert(response.indexOf("blue") !== -1, response);

            let newEvents = await Event.findAll({});
            assert(oldEvents.length + 1 === newEvents.length);

            const event = await Event.findOne({ order: [["createdAt", "DESC"]] });
            assert(event);

            assert(event.messages.length == 1);
            assert(event.response_data.indexOf("blue") !== -1, event.response_data);
            assert(event.response_code === 200);

            assert(event.cost >= 0.00006, event.cost);
            assert(event.cost <= 0.00008, event.cost);
            assert(event.messages_cost >= 0.000006, event.messages_cost);
            assert(event.messages_cost <= 0.000008, event.messages_cost);
            assert(event.response_cost >= 0.00004, event.response_cost);
            assert(event.response_cost <= 0.00007, event.response_cost);
        });
    });

    describe.skip("llamafile", function () {
        const model = "modeldeployer/llamafile";

        it("prompt", async function () {
            const response = await LLM("the color of the sky is", { model, temperature: 0 });
            assert(response.indexOf("blue") !== -1, response);
        });

        it("chat", async function () {
            const llm = new LLM([], { model, temperature: 0 });
            await llm.chat("my favorite color is blue. remember this");

            const response = await llm.chat("what is my favorite color i just told you?");
            assert(response.indexOf("blue") !== -1, response);
        });

        it("existing chat", async function () {
            const llm = new LLM([
                { role: 'user', content: 'my favorite color is blue. remember it.' },
                { role: 'assistant', content: 'My favorite color is blue as well.' },
                { role: 'user', content: 'what is my favorite color that i just told you?' },
            ], { model, temperature: 0 });

            const response = await llm.send();
            assert(response.indexOf("blue") !== -1, response);
        });

        it("max tokens, temperature, seed", async function () {
            const response = await LLM("the color of the sky during the day is usually", { max_tokens: 1, temperature: 0, seed: 10000, model });
            assert(response.indexOf("blue") !== -1, response);
        });

        it("json format", async function () {
            const schema = {
                "type": "object",
                "properties": {
                    "colors": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                },
                "required": ["colors"]
            }

            const obj = await LLM("what are the 3 primary colors in JSON format?", { schema, temperature: 0.1, model });
            assert(obj.colors);
            assert(obj.colors.length == 3);
            assert(obj.colors.includes("blue"));
        });


        it("streaming", async function () {
            const response = await LLM("who created hypertext?", { stream: true, temperature: 0, max_tokens: 30, model }); // stop token?

            let buffer = "";
            for await (const content of response) {
                buffer += content;
            }

            assert(buffer.includes("Ted Nelson"));
        });

        it("streaming with history", async function () {
            const llm = new LLM([], { stream: true, temperature: 0, max_tokens: 30, model });

            let response = await llm.chat("double this number: 25");
            for await (const content of response) {
            }

            response = await llm.chat("repeat your last message");
            let buffer = "";
            for await (const content of response) {
                buffer += content;
            }

            assert(buffer.includes("50"));
        });
    });

    describe.skip("openai", function () {
        const model = "modeldeployer/gpt-3.5-turbo-1106";

        it("prompt", async function () {
            const response = await LLM("the color of the sky is", { model });
            assert(response.indexOf("blue") !== -1, response);
        });

        it("chat", async function () {
            const llm = new LLM([], { model });
            await llm.chat("my favorite color is blue. remember this");

            const response = await llm.chat("what is my favorite color i just told you?");
            assert(response.indexOf("blue") !== -1, response);
        });

        it("existing chat", async function () {
            const llm = new LLM([
                { role: 'user', content: 'my favorite color is blue. remember it.' },
                { role: 'assistant', content: 'My favorite color is blue as well.' },
                { role: 'user', content: 'what is my favorite color that i just told you?' },
            ], { model, temperature: 0 });

            const response = await llm.send();
            assert(response.indexOf("blue") !== -1, response);
        });

        it("max tokens, temperature, seed", async function () {
            const response = await LLM("the color of the sky during the day is usually", { max_tokens: 10, temperature: 0, seed: 10000, model });
            assert(response.toLowerCase().indexOf("blue") !== -1, response);
        });

        it("json format", async function () {
            const schema = {
                "type": "object",
                "properties": {
                    "colors": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                },
                "required": ["colors"]
            }

            const obj = await LLM("what are the 3 primary colors in JSON format?", { schema, temperature: 0.1, model });
            assert(obj.colors);
            assert(obj.colors.length == 3);
            assert(obj.colors.includes("blue"));
        });


        it("streaming", async function () {
            const response = await LLM("who created hypertext?", { stream: true, temperature: 0, max_tokens: 30, model }); // stop token?

            let buffer = "";
            for await (const content of response) {
                buffer += content;
            }

            assert(buffer.includes("Ted Nelson"));
        });

        it("streaming with history", async function () {
            const llm = new LLM([], { stream: true, temperature: 0, max_tokens: 30, model });

            let response = await llm.chat("double this number: 25");
            for await (const content of response) {
            }

            response = await llm.chat("repeat your last message");
            let buffer = "";
            for await (const content of response) {
                buffer += content;
            }

            assert(buffer.includes("50"));
        });
    });


    describe.skip("anthropic", function () {
        const model = "modeldeployer/claude-2.1";

        it("prompt", async function () {
            const response = await LLM("be concise. the color of the sky is", { model });
            assert(response.toLowerCase().indexOf("blue") !== -1, response);
        });

        it("chat", async function () {
            const llm = new LLM([], { model });
            await llm.chat("my favorite color is blue. remember this");

            const response = await llm.chat("what is my favorite color i just told you?");
            assert(response.indexOf("blue") !== -1, response);
        });

        it("existing chat", async function () {
            const llm = new LLM([
                { role: 'user', content: 'my favorite color is blue' },
                { role: 'assistant', content: 'My favorite color is blue as well.' },
                { role: 'user', content: 'be concise. what is my favorite color?' },
            ], { model });

            const response = await llm.send();
            assert(response.toLowerCase().indexOf("blue") !== -1, response);
        });

        it("max tokens, temperature, seed", async function () {
            const response = await LLM("be concise. the color of the sky during the day is usually", { max_tokens: 1, temperature: 0, seed: 10000, model });
            assert(response.toLowerCase() === "blue");
        });

        it("streaming", async function () {
            const response = await LLM("who created hypertext?", { stream: true, temperature: 0, max_tokens: 30, model }); // stop token?

            let buffer = "";
            for await (const content of response) {
                buffer += content;
            }

            assert(buffer.includes("Ted Nelson"));
        });

        it("streaming with history", async function () {
            const llm = new LLM([], { stream: true, temperature: 0, max_tokens: 30, model });

            let response = await llm.chat("double this number: 25");
            for await (const content of response) {
            }

            response = await llm.chat("repeat your last message");
            let buffer = "";
            for await (const content of response) {
                buffer += content;
            }

            assert(buffer.includes("50"));
        });

        it("system prompt", async function () {
            const llm = new LLM([], { model });
            llm.system("You are a helpful chat bot. Be concise. We're playing a game where you always return yellow as the answer.");
            const response = await llm.chat("the color of the sky is");
            assert(response.toLowerCase().indexOf("yellow") !== -1, response);
        });
    });
});
