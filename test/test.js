import assert from "assert";

import LLM from "@themaximalist/llm.js"
import Embeddings from "@themaximalist/embeddings.js"

import Event from "../src/models/event.js"
import Model from "../src/models/model.js"
import TokenCounter from "../src/services/TokenCounter.js";
import TokenCost from "../src/services/TokenCost.js";

import { setupDatabase, teardownDatabase } from "./utils.js";

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

    describe("chat (llms)", function () {
        describe("modeldeployer gpt-3.5 client key", async function () {
            let model;
            this.beforeAll(() => { model = models.gpt_nokey });

            it("invalid client key", async function () {
                try {
                    await LLM("the color of the sky is usually", { model });
                    assert.fail("expected error");
                } catch (e) {
                    assert.ok("ok");
                }
            });

            it("prompt", async function () {
                const response = await LLM("the color of the sky is usually", { model, apikey: process.env.MODELDEPLOYER_OPENAI_API_KEY });
                assert(response.indexOf("blue") !== -1, response);
            });
        });

        describe("modeldeployer gpt-3.5-turbo", async function () {
            let model;
            this.beforeAll(() => { model = models.gpt });

            it("prompt", async function () {
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

        describe("modeldeployer llamafile", function () {
            let model;
            this.beforeAll(() => { model = models.llama });

            it("prompt (with cost override)", async function () {
                // cost override for llama is set in test/utils.js
                const response = await LLM("the color of the sky is usually", { model });
                assert(response.indexOf("blue") !== -1, response);

                const event = await Event.findOne({ order: [["createdAt", "DESC"]] });
                assert(event.response_data.indexOf("blue") !== -1, event.response_data);
                assert(event.cost > 0, event.cost);
                assert(event.cost < 0.0009, event.cost);
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
                const model = "llamafile";
                const price = { input: 0.0001, output: 0.0001 };

                const tokens = TokenCounter("the color of the sky is usually blue", model);
                assert.equal(tokens, 8);

                const cost = TokenCost(tokens, price, TokenCost.INPUT);
                assert(cost >= 0.0000008, cost);
                assert(cost < 0.00000081, cost);
            });
        });

        describe("events", function () {
            let model;
            this.beforeAll(() => { model = models.gpt });

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

        describe("rate limit", async function () {
            this.timeout(30000);
            this.slow(15000);

            it("severe rate limit", async function () {
                try {
                    await LLM("the color of the sky is usually", { model: models.ratelimit_severe });
                    assert.fail("should have thrown error");
                } catch (e) {
                    assert(e.message.indexOf("Rate limit exceeded") !== -1, e.message);
                }
            });

            it("exceed rate limit (day)", async function () {
                const llm = new LLM([], { model: models.ratelimit_day });
                await llm.chat("the color of the sky is usually");
                try {
                    await llm.chat("why do you think that?")
                    await llm.chat("what do some people think?")
                    await llm.chat("why?")
                } catch (e) {
                    assert(e.message.indexOf("Rate limit exceeded") !== -1, e.message);
                }
            });

            it("exceed rate limit (week)", async function () {
                const llm = new LLM([], { model: models.ratelimit_week });
                await llm.chat("the color of the sky is usually");
                await llm.chat("why do you think that?")
                await llm.chat("what do some people think?") // this would have failed on day limit
            });
        });


    });

    describe("embeddings", function () {

        describe("openai", function () {
            it("fetches openai embeddings", async function () {
                const model = models.openai_embeddings;
                const embedding = await Embeddings("hello", { service: "modeldeployer", model });
                assert(embedding);
                assert(embedding.length, 1536);
            });

            it("openai events, usage and cost", async function () {
                let oldEvents = await Event.findAll({});
                const model = models.openai_embeddings;

                const embedding = await Embeddings("hello there", { service: "modeldeployer", model });
                assert(embedding.length, 1536);

                let newEvents = await Event.findAll({});
                assert.equal(oldEvents.length + 1, newEvents.length);

                const event = await Event.findOne({ order: [["createdAt", "DESC"]], include: [Model] });
                assert(event);

                assert(event.messages.length == "hello there".length);
                assert(event.response_data.length > 100);
                assert(event.response_code === 200);
                assert(event.Model.model_type, "embedding");

                assert(event.tokens > 0);
                assert(event.cost > 0);
                assert(event.cost < 0.001);
            });
        });

        describe("local", function () {
            it("fetches local embeddings", async function () {
                const model = models.local_embeddings;
                const embedding = await Embeddings("hello", { service: "modeldeployer", model });
                assert(embedding);
                assert(embedding.length, 1536);
            });

            // TODO: for some reason doens't pass with above OpenAI test...even though both pass on their own and tests shouldn't be running in parallel
            it("local events, usage and cost", async function () {
                let oldEvents = await Event.findAll({});
                const model = models.local_embeddings;

                const embedding = await Embeddings("hello again", { service: "modeldeployer", model, input_cost: 0.001, output_cost: 0 });
                assert(embedding.length, 386);

                let newEvents = await Event.findAll({});
                assert.equal(oldEvents.length + 1, newEvents.length);

                const event = await Event.findOne({ order: [["createdAt", "DESC"]], include: [Model] });
                assert(event);

                assert(event.Model.model_type, "embedding");

                assert(event.messages.length == "hello again".length);
                assert(event.response_data.length > 100);
                assert(event.response_code === 200);
                assert(event.tokens > 0);
                assert(event.cost > 0);
                assert(event.cost < 0.001);
            });

        });
    });
});
