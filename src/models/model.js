import Sequelize from "sequelize";
const DataTypes = Sequelize.DataTypes;
import User from "./user.js";

import sequelize from "../sequelize.js";

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
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, { sequelize });

Model.belongsTo(User, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
User.hasMany(Model, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })