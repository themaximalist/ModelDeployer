import debug from "debug";
const log = debug("modeldeployer:api:embeddings");

// import Chat from "../services/Chat.js";
import Embeddings from "../../services/Embeddings.js";

export default async function embeddings(req, res) {
    try {
        const session = { apikey: req.session.apikey, apikey_model_id: req.session.apikey_model_id };
        const data = await Embeddings(req.body, session);
        return res.json({ ok: true, data });
    } catch (e) {
        console.log(e);
        log(`Error: ${e.message}`);
        return res.json({ error: e.message });
    } finally {
        res.end();
    }
}

/*
export async function _chat(req, res) {
    try {
        const session = {
            apikey: req.session.apikey,
            apikey_model_id: req.session.apikey_model_id,
        };

        console.log("REQ", req.body);

        const data = await Chat(req.body, session);

        if (typeof data === "string") {
            return res.json({ ok: true, data });
        }

        for await (const message of data) {
            res.write(`data: ${JSON.stringify({ ok: true, content: message })}\n`);
        }
    } catch (e) {
        console.log(e);
        log(`Error: ${e.message}`);
        return res.json({ error: e.message });
    } finally {
        res.end();
    }
}
*/