import Client from 'clash-royale-api';
import players from '../database/models/players';

export const indexDatabase = async(client: Client) => {
    const res = await players.findAll({
        limit: 10,
        order: [['updatedAt', 'ASC']]
    })
    if (!res) return

    res.forEach(async(playerData) => {
        const tag = playerData.dataValues.tag;

        const reply = await client.player(tag).catch(console.log)
        if (!reply) return;

        players.update({
            name: reply.data.name
        }, {
            where: {
                tag: tag
            }
        })
    })
};
