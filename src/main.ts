import express from 'express';
import Client from 'clash-royale-api';
import { indexDatabase } from './scripts/indexdatabase';
import players from './database/models/players';
import { Op, col, fn, literal, where } from 'sequelize';
import { sequelise } from './database/sequelize';
import { Tables, databasePlayer } from './types/database';
require('dotenv').config();

const app = express();
const client = new Client();

app.use(express.json());

app.get('/players', async (req, res) => {
    const params = new URLSearchParams(req.url.split('?')[1] ?? '');

    const tag = params.get('playerTag');
    const name = params.get('playerName');
    if (tag) {
        const search = tag.startsWith('#') ? tag : `#${tag}`;

        client
            .player(search)
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

                return res.send({
                    code: 200,
                    message: 'Valid data',
                    player: player.data
                });
            })
            .catch(() => {
                return res.send({
                    code: 400,
                    ok: false,
                    message: 'Unexisting player'
                });
            });
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

const port = 8082;
app.listen(port, () => {
    console.log(`[*] App listening on port ${port}`);

    // Periodically indexing database
    setInterval(() => {
        indexDatabase(client);
    }, 10000);
});
