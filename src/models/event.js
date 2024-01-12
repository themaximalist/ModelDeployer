import Sequelize from "sequelize";
const DataTypes = Sequelize.DataTypes;
import Model from "./model.js";
import APIKey from "./apikey.js";

import sequelize from "../sequelize.js";

export default class Event extends Sequelize.Model {
    inputData() {
        if (this.Model.model_type === "llm") {
            return this.messages[0].content;
        }

        return this.messages;
    }

    outputData() {
        return this.response_data;
    }

    inputPreview() {
        const data = this.inputData();
        if (data && data.length > 0) {
            return `${this.inputData().substring(0, 40)}...`;
        }
    }

    outputPreview() {
        if (this.Model.model_type === "llm") {
            return this.outputData().substring(0, 70);
        } else if (this.Model.model_type === "embedding") {
            return this.outputData().substring(0, 20);
        } else {
            return "";
        }
    }

}

Event.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    options: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: false
    },
    messages: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false
    },
    messages_tokens: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    messages_cost: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
    },
    response_data: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    response_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    response_tokens: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    response_cost: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
    },
    tokens: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    cost: {
        type: DataTypes.DECIMAL,
        defaultValue: 0,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, { sequelize });

Event.belongsTo(Model, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Model.hasMany(Event, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })

Event.belongsTo(APIKey, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
APIKey.hasMany(Event, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })