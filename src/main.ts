import express from 'express';
import Client from 'clash-royale-api';

const app = express();
const client = new Client();

app.use(express.json());

app.get('/players', async (req, res) => {
    const params = new URLSearchParams(req.url.split('?')[1] ?? '');

    const tag = params.get('playerTag');
    if (tag) {
        const search = tag.startsWith('#') ? tag : `#${tag}`;

        client
            .player(search)
            .then((player) => {
                if (!player) return;
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
});
