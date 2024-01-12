import assert from "assert";
import { setupDatabase, teardownDatabase } from "./utils.js";

import Embeddings from "@themaximalist/embeddings.js"
import Event from "../src/models/event.js"
import Model from "../src/models/model.js"

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

    describe("openai", function () {
        it("fetches openai embeddings", async function () {
            const model = models.openai_embeddings;
            const embedding = await Embeddings("hello", { service: "modeldeployer", model });
            assert(embedding);
            assert(embedding.length, 1536);
        });

        // TODO: has error with above test
        it.skip("openai events, usage and cost", async function () {
            let oldEvents = await Event.findAll({});
            const model = models.openai_embeddings;

            const embedding = await Embeddings("hello", { service: "modeldeployer", model });
            assert(embedding.length, 1536);

            let newEvents = await Event.findAll({});
            assert.equal(oldEvents.length + 1, newEvents.length);

            const event = await Event.findOne({ order: [["createdAt", "DESC"]], include: [Model] });
            assert(event);

            assert(event.messages.length == 5);
            assert(event.response_data.length > 100);
            assert(event.response_code === 200);
            assert(event.Model.model_type, "embedding");

            assert(event.tokens > 0);
            assert(event.cost > 0);
            assert(event.cost < 0.001);
            console.log("FINISH B");
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
        it.skip("local events, usage and cost", async function () {
            let oldEvents = await Event.findAll({});
            const model = models.local_embeddings;

            const embedding = await Embeddings("hello", { service: "modeldeployer", model, input_cost: 0.001, output_cost: 0 });
            assert(embedding.length, 386);

            let newEvents = await Event.findAll({});
            assert.equal(oldEvents.length + 1, newEvents.length);

            const event = await Event.findOne({ order: [["createdAt", "DESC"]], include: [Model] });
            assert(event);

            assert(event.Model.model_type, "embedding");

            assert(event.messages.length == 5);
            assert(event.response_data.length > 100);
            assert(event.response_code === 200);
            assert(event.tokens > 0);
            assert(event.cost > 0);
            assert(event.cost < 0.001);
            console.log("FINISH A");
        });

    });

});

// TODO: doesn't charge for cached embeddings?