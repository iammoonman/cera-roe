type Player = {
    playerID: string,
    dps?: DPS,
    stats: Stat[],
    mana?: string,
    cards: CardData[]
}
type CardData = { name: string, imageuri: string, tooltip: string }
type DPS = { elo: number, stats: any, history: { draftID: number, new_elo: number }[] }
export type { Player }
export type { CardData }
export type { DPS }

type Stat = {
    abbr: string,
    statn: string | number,
    desc: string
}
export type { Stat }