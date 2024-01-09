import Sequelize from "sequelize";
const DataTypes = Sequelize.DataTypes;
import Model from "./model.js";

import sequelize from "../sequelize.js";

export default class APIKey extends Sequelize.Model {
}

APIKey.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, { sequelize });

APIKey.belongsTo(Model, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Model.hasMany(APIKey, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })