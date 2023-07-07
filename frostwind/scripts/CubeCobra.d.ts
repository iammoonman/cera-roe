type CubeCobraResponse = {
    name: string;
    id: string;
    cardCount: number;
    basics: string[];
    description: string;
    cards: {
        id: string;
        mainboard: CubeCobraCard[];
        maybeboard: CubeCobraCard[];
    }
}

type CubeCobraCard = {
    cmc: number;
    colorCategory: any;
    finish: string;
    rarity: any;
    status: string;
    tags: string[];
    cardID: string;
    details: {
        elo: number;
        popularity: number;
        set: string;
        collector_number: string;
        scryfall_id: string;
    }
    index: number;
    board: string;
}