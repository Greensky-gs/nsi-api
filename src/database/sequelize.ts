import { Sequelize } from 'sequelize';
import { readdirSync } from 'node:fs';

export const sequelise = new Sequelize({
    dialect: 'mysql',
    database: process.env.db,
    username: process.env.dbu,
    password: process.env.dbp,
    host: process.env.dbh,
    logging: false
});

sequelise.authenticate();
sequelise.sync({ alter: true });

readdirSync('./dist/database/models').forEach((fileName) => {
    require(`./models/${fileName}`)
});
