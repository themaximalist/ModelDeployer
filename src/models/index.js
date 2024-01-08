
/*
import Sequelize from "sequelize";
const DataTypes = Sequelize.DataTypes;
import { sequelize } from "@themaximalist/hummingbird.js"

Result.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    SearchId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    QueryId: {
        type: DataTypes.UUID,
        allowNull: false,
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
    image_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    thumbnail_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    favorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize,
});

Result.belongsTo(Concept, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
Concept.hasMany(Result, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })

module.exports = Result;
*/