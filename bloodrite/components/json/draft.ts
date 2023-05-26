type Draft = {
    draftID: string,
    tag: string,
    date: string,
    title: string,
    rounds: Round[],
    players: DraftPlayer[],
    description?: string
}
type Round = { roundNUM: string, completed: boolean, matches: Match[] }
type DraftPlayer = { playerID: string, score: number, gwp: number, ogp: number, omp: number }
type Match = { players: string[], scores: number[] }

export type { Draft }
export type { Match }
export type { Round }


type Tourney = {
    eventID: string,
    tag: string,
    date: string,
    title: string,
    players: EventPlayer[],
    nodes: BracketNode[],
}

type EventPlayer = {
    playerID: string,
    wins: number,
    losses: number,
    rank: number,
    seed: number
}

type BracketNode = {
    bnid: number, // incrementing number for id
    round: number,
    feeds: number[],
    match?: EventMatch,
    loser: boolean
}

type EventMatch = {
    players: string[],
    scores: number[],
    breaker?: number[]
}

export type { Tourney, BracketNode, EventMatch, EventPlayer }