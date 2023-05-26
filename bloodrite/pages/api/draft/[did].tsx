import { NextApiRequest, NextApiResponse } from "next";
import { Draft } from "../../../components/json/draft";
import Drafts from './drafts.json'
const dl: Draft[] = Drafts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { did } = req.query
        const d = dl.find((d) => (d.draftID === did))
        if (d === undefined) { res.status(404) } else { res.status(200).json({ draft: d }) }
        res.end()
    }
}