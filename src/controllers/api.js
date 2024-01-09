import debug from "debug";
const log = debug("modeldeployer:api:chat");

import Chat from "../services/Chat.js";

export async function chat(req, res) {
    try {
        const data = await Chat(req);

        if (typeof data === "string") {
            return res.json({ ok: true, data });
        }

        for await (const message of data) {
            res.write(`data: ${JSON.stringify({ ok: true, content: message })}\n`);
        }
    } catch (e) {
        log(`Error: ${e.message}`);
    } finally {
        res.end();
    }
}
