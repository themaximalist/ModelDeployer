import Sequelize from "sequelize";
const DataTypes = Sequelize.DataTypes;

// TODO: does this make a single connection point for all projects?
import Hummingbird from "@themaximalist/hummingbird.js"

export default class Model extends Sequelize.Model {
}

Model.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    service: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    options: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: false
    },
    secrets: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: false
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, { sequelize: Hummingbird.sequelize });