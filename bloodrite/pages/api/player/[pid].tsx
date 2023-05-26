import Players from './players.json'
import { Player, CardData, DPS } from '../../../components/json/player'
const pl: Player[] = Players
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { query: { pid }, body } = req
        const p: Player | undefined = pl.find((d) => (d.playerID === pid))
        const c: CardData | undefined = body.card
        const dps: DPS | undefined = body.dps
        if (p === undefined) {
            res.status(404).end()
        } else {
            if (c !== undefined) {
                // Add more checks against the data.
                // The name field can't be too long.
                if (c.name.length > 12 || c.tooltip.length > 50 || !/\.jpg\?\d*/.test(c.imageuri)) { res.status(404).end() }
                // The imageuri has to be a uri.
                // The tooltip can't be too long either.
                pl.map((d) => { if (d.playerID == pid) { d.cards.push(c) } })
                fs.writeFileSync('./pages/api/player/players.json', JSON.stringify(Players))
                res.status(200).end()
            }
            if (dps !== undefined) {
                // Probably replacing it completely is best.
                // The stats on a separate route, handled by the bot making API calls?
                pl.map((d) => {
                    if (d.dps && d.playerID === pid) {
                        d.dps = dps
                    }
                })
                res.status(200).end()
            }
            res.status(404).end()
        }
    } else if (req.method === "GET") {
        const { pid } = req.query
        const p = pl.find((d) => (d.playerID === pid))
        if (p === undefined) { res.status(404) } else { res.status(200).json({ player: p }) }
        res.end()
    }
}