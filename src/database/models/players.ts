import { DataTypes } from 'sequelize';
import { Tables } from '../../types/database';
import { sequelise } from '../sequelize';

const players = sequelise.define(Tables.Players, {
    tag: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    }
});
players.sync();

export default players;
