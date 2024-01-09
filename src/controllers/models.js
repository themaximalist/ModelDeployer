import Model from "../models/model.js"
import Models from "../managers/models.js"

import BaseController from "./base.js";

export default class ModelsController extends BaseController {
    constructor() {
        super(...arguments);
        this.object = "model";
        this.namespace = "models";
        this.model = Model;
        this.manager = new Models();
    }
}