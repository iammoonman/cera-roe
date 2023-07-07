type MoxfieldResponse = {
    id: string;
    name: string;
    format: string;
    description: string;
    visibility: string;
    publicUrl: string;
    publicId: string;
    sideboardCount: number;
    sideboard: Record<string, MoxfieldCard>;
    mainboardCount: number;
    mainboard: Record<string, MoxfieldCard>;
    maybeboardCount: number;
    maybeboard: Record<string, MoxfieldCard>;
    commandersCount: number;
    commanders: Record<string, MoxfieldCard>;
    companionsCount: number;
    companions: Record<string, MoxfieldCard>;
    attractionsCount: number;
    attractions: Record<string, MoxfieldCard>;
    stickersCount: number;
    stickers: Record<string, MoxfieldCard>;
    signatureSpellsCount: number;
    signatureSpells: Record<string, MoxfieldCard>;
}

type MoxfieldCard = {
    quantity: number;
    boardType: string;
    finish: string;
    card: MoxfieldSubScryfallObject;
    printingData?: MoxfieldPrintingData[]
}

type MoxfieldPrintingData = {
    id: string;
    imageCardId: string;
    quantity: number;
    card: MoxfieldSubScryfallObject;
}

type MoxfieldSubScryfallObject = {
    id: string;
    uniqueCardId: string;
    scryfall_id: string;
    set: string;
    set_name: string;
    name: string;
    cn: string;
    layout: string;
    cmc: unknown;
}