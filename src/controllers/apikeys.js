import APIKey from "../models/apikey.js"
import APIKeys from "../managers/apikeys.js"

import BaseController from "./base.js";

export default class APIKeysController extends BaseController {
    constructor() {
        super(...arguments);
        this.object = "apikey";
        this.namespace = "apikeys";
        this.model = APIKey;
        this.manager = APIKeys;
    }
}