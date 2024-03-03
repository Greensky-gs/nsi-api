import express, { Response } from 'express';
import Client from 'clash-royale-api';
import { indexDatabase } from './scripts/indexdatabase';
import players from './database/models/players';
import { Op, col, fn, literal, where } from 'sequelize';
import { sequelise } from './database/sequelize';
import { Tables, databasePlayer } from './types/database';
import cors from 'cors';
require('dotenv').config();

const app = express();
const client = new Client();

app.use(express.json());
app.use(cors());

const handleSearchTag = (url: string, res?: Response) => {
    client
        .player(url)
        .then((player) => {
            if (!player) return;

            players
                .findOrCreate({
                    where: {
                        tag: player.data.tag
                    },
                    defaults: {
                        tag: player.data.tag,
                        name: player.data.name
                    }
                })
                .then(([dbres, created]) => {
                    if (!created)
                        dbres.update({
                            tag: player.data.tag,
                            name: player.data.name
                        });
                });
            if (player.data.clan?.tag) {
                client
                    .clan(player.data.clan.tag)
                    .then((clan) => {
                        if (!clan) return;

                        const memberList = clan.data.memberList.map((x) => x.tag);

                        players
                            .findAll({
                                where: {
                                    tag: {
                                        [Op.in]: memberList
                                    }
                                }
                            })
                            .then((playerList) => {
                                if (!playerList) return;

                                const ids = playerList.map((x) => x.dataValues.tag);
                                const notIn = clan.data.memberList.filter((x) => !ids.includes(x.tag));

                                players.bulkCreate(notIn.map((x) => ({ tag: x.tag, name: x.name }))).catch(() => {});
                            })
                            .catch(() => {});
                    })
                    .catch(() => {});
            }

            return res?.send({
                code: 200,
                message: 'Valid data',
                player: player.data
            });
        })
        .catch((error) => {
            console.log(error);
            return res?.send({
                code: 400,
                ok: false,
                message: 'Unexisting player'
            });
        });
};

app.get('/players', async (req, res) => {
    const params = new URLSearchParams(req.url.split('?')[1] ?? '');

    const tag = params.get('playerTag');
    const name = params.get('playerName');
    if (tag) {
        const search = (tag.startsWith('#') ? tag : `#${tag}`)?.toUpperCase();

        handleSearchTag(search, res);
        return;
    } else {
        const search = name.toLowerCase();
        const results = (await sequelise
            .query(
                `SELECT * FROM ${Tables.Players} WHERE LOWER(name)="${search
                    .toLowerCase()
                    .replace(/"/g, '\\"')}" LIMIT 10;`
            )
            .catch(console.log)) as void | [databasePlayer[]];

        if (!results)
            return res.send({
                ok: true,
                code: 200,
                players: []
            });
        return res.send({
            ok: true,
            code: 200,
            players: results[0].map((x) => ({ tag: x.tag, name: x.name }))
        });
    }

    res.send({
        code: 200,
        ok: true
    });
});
app.get('*', (req, res) => {
    res.send({
        code: 404,
        ok: false,
        message: 'Are you lost ?'
    });
});

const randomRequest = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz0123456789'.toUpperCase();
    const randomChar = () => letters[Math.floor(Math.random() * letters.length)];

    const tag = `#${new Array(9).fill(null).map(() => randomChar()).join('')}`;

    handleSearchTag(tag);

    setTimeout(() => {
        randomRequest();
    }, 20000);
};

app.listen(process.env.port, () => {
    console.log(`[*] App listening on port ${process.env.port}`);

    // Periodically indexing database
    setInterval(() => {
        indexDatabase(client);
    }, 10000);

    randomRequest();
});
