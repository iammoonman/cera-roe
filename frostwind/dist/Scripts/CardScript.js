"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@tabletop-playground/api");
const globalState = {
    loyalty: undefined,
    stats: undefined,
    loyaltyUI: undefined,
    statsUI: undefined,
};
const debounce = (func, wait) => {
    let d = undefined;
    return (args) => {
        if (d !== undefined)
            clearTimeout(d);
        d = setTimeout(() => {
            if (api_1.refCard.isValid() && api_1.refCard.getStackSize() === 1)
                func.apply(args);
        }, wait);
    };
};
const debounceCardDetails = debounce(generateCardDetails, 1000);
debounceCardDetails();
api_1.refCard.onCreated.add(() => {
    api_1.refCard.setName("");
    debounceCardDetails();
});
api_1.refCard.onInserted.add(() => {
    api_1.refCard.setName("");
    api_1.refCard.removeUI(0);
});
api_1.refCard.onRemoved.add(() => {
    api_1.refCard.setName("");
    debounceCardDetails();
});
const createTokens = (button, player) => {
    let setting = button.getText() === "Tokens";
    const selfURL = api_1.refCard.getCardDetails().textureOverrideURL;
    const [front_face] = selfURL.match(/(?<=&front_face=)(false|true)/g) ?? ["true"];
    const [sf_id] = selfURL.match(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/g) ?? [];
    if (sf_id !== undefined) {
        fetch(`https://api.scryfall.com/cards/${sf_id}`)
            .then((r) => r.json())
            .then(async (v) => {
            const position = api_1.refCard.getPosition();
            const { all_parts } = v;
            let main_stack = undefined;
            for (let index = 0; index < all_parts.length; index++) {
                const element = all_parts[index];
                if (element.id === sf_id)
                    continue;
                if (setting && element.component !== "token")
                    continue;
                if (!setting && !element.type_line.includes("Emblem"))
                    continue;
                if (main_stack === undefined) {
                    const c = await fetch(`https://api.scryfall.com/cards/${element.id}`);
                    const j = await c.json();
                    // @ts-expect-error
                    const q = api_1.world.createObjectFromTemplate("31E5DB224CB620FF0B35E79BB7BB8D02", position.add([0, 8, 1]));
                    if (["normal", "adventure", "flip", "split", "meld", "leveler", "class", "saga", "planar", "vanguard", "token", "augment", "host", "emblem"].includes(j.layout)) {
                        q.setTextureOverrideURL(j.image_uris.normal.concat(`&scryfall_id=${element.id}&front_face=true`));
                    }
                    else {
                        q.setTextureOverrideURL(j.card_faces[0].image_uris.normal.concat(`&scryfall_id=${element.id}&front_face=true`));
                    }
                    main_stack = q;
                }
                else {
                    const c = await fetch(`https://api.scryfall.com/cards/${element.id}`);
                    const j = await c.json();
                    // @ts-expect-error
                    const q = api_1.world.createObjectFromTemplate("31E5DB224CB620FF0B35E79BB7BB8D02", position.add([0, 8, 1]));
                    if (["normal", "adventure", "flip", "split", "meld", "leveler", "class", "saga", "planar", "vanguard", "token", "augment", "host", "emblem"].includes(j.layout)) {
                        q.setTextureOverrideURL(j.image_uris.normal.concat(`&scryfall_id=${element.id}&front_face=true`));
                    }
                    else {
                        q.setTextureOverrideURL(j.card_faces[0].image_uris.normal.concat(`&scryfall_id=${element.id}&front_face=true`));
                    }
                    main_stack.addCards(q);
                }
            }
        });
    }
};
const transformCard = () => {
    const selfURL = api_1.refCard.getCardDetails().textureOverrideURL;
    const [front_face] = selfURL.match(/(?<=&front_face=)(false|true)/g) ?? ["true"];
    const [sf_id] = selfURL.match(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/g) ?? [];
    if (sf_id !== undefined) {
        fetch(`https://api.scryfall.com/cards/${sf_id}`)
            .then((r) => r.json())
            .then((v) => {
            const { name, layout, mana_cost, cmc, type_line, oracle_text, power, toughness, rarity, card_faces, all_parts } = v;
            api_1.refCard.setName(name ?? "New Card");
            makeDetailedDescription(layout, { name, mana_cost, cmc, type_line, oracle_text, power, toughness, rarity, all_parts }, card_faces, front_face !== "true");
        });
    }
};
function makeDetailedDescription(layout, easy_face, [front, back] = [], front_face = true) {
    // Add ui elements
    const RightSide = new api_1.UIElement();
    RightSide.height = 1060;
    RightSide.width = 760;
    RightSide.useWidgetSize = false;
    RightSide.zoomVisibility = api_1.UIZoomVisibility.ZoomedOnly;
    RightSide.position = new api_1.Vector(4.5, -3.5, -0.1);
    RightSide.rotation = new api_1.Rotator(180, 180, 0);
    RightSide.scale = 0.08;
    RightSide.anchorX = 0;
    RightSide.anchorY = 0;
    RightSide.useTransparency = true;
    const LeftSide = new api_1.UIElement();
    // LeftSide.height = 70;
    // LeftSide.width = 170;
    LeftSide.useWidgetSize = true;
    LeftSide.zoomVisibility = api_1.UIZoomVisibility.Regular;
    LeftSide.position = new api_1.Vector(4.5, 3.5, -0.1);
    LeftSide.rotation = new api_1.Rotator(180, 180, 0);
    LeftSide.scale = 0.08;
    LeftSide.anchorX = 1;
    LeftSide.anchorY = 0;
    LeftSide.useTransparency = true;
    const LeftBorder = new api_1.VerticalBox();
    const RightBorder = new api_1.Border();
    RightBorder.setColor([1, 1, 1, 0.9]);
    const StatCounterText = new api_1.Button();
    StatCounterText.setFontSize(24);
    StatCounterText.setText("+0/+0");
    StatCounterText.onClicked.add(() => null);
    const StatCounterContainer = new api_1.UIElement();
    StatCounterContainer.width = 140;
    StatCounterContainer.height = 75;
    StatCounterContainer.useWidgetSize = false;
    StatCounterContainer.zoomVisibility = api_1.UIZoomVisibility.Both;
    StatCounterContainer.position = new api_1.Vector(-3, -1.65, -0.1);
    StatCounterContainer.rotation = new api_1.Rotator(180, 180, 0);
    StatCounterContainer.scale = 0.08;
    StatCounterContainer.anchorX = 0;
    StatCounterContainer.anchorY = 0;
    StatCounterContainer.useTransparency = true;
    StatCounterContainer.widget = StatCounterText;
    globalState.statsUI = StatCounterText;
    api_1.refCard.addUI(StatCounterContainer);
    // UI is different depending on layout.
    if (layout === "normal") {
        const Name = easy_face.name ?? "";
        const Type_Line = easy_face.type_line ?? "";
        const Mana_Cost = easy_face.mana_cost ?? "NO MANA COST";
        const Oracle_Text = easy_face.oracle_text ?? "";
        const Canvas_Text = `${Name} :: ${Mana_Cost}\n${Type_Line} :: ${(easy_face.rarity ?? 'S').toUpperCase()}\n${Oracle_Text.replace(/\(/g, "[size=24][i](").replace(/\)/g, ")[/i][/size]")}${(easy_face["type_line"] ?? '').includes("Planeswalker") ? "\nStarting Loyalty: " + easy_face["loyalty"] : ""}${(easy_face["type_line"] ?? '').includes("Creature") || (easy_face["type_line"] ?? '').includes("Vehicle") ? "\n" + easy_face["power"] + "/" + easy_face["toughness"] : ""}`;
        RightBorder.setChild(new api_1.RichText().setText(Canvas_Text).setFontSize(24).setAutoWrap(true).setTextColor([0, 0, 0, 1])); // , 0, 0, 760, 1500);
        if ((easy_face["type_line"] ?? '').includes("Planeswalker")) {
            const LoyaltyText = new api_1.Button();
            LoyaltyText.setFontSize(48);
            LoyaltyText.setText(`${easy_face["loyalty"]}`);
            LoyaltyText.onClicked.add(() => null);
            globalState.loyalty = parseInt(`${easy_face["loyalty"]}`);
            const LoyaltyContainer = new api_1.UIElement();
            LoyaltyContainer.width = 100;
            LoyaltyContainer.height = 100;
            LoyaltyContainer.useWidgetSize = false;
            LoyaltyContainer.zoomVisibility = api_1.UIZoomVisibility.Both;
            LoyaltyContainer.position = new api_1.Vector(-3.5, -2.13, -0.1);
            LoyaltyContainer.rotation = new api_1.Rotator(180, 180, 0);
            LoyaltyContainer.scale = 0.08;
            LoyaltyContainer.anchorX = 0;
            LoyaltyContainer.anchorY = 0;
            LoyaltyContainer.useTransparency = true;
            LoyaltyContainer.widget = LoyaltyText;
            globalState.loyaltyUI = LoyaltyText;
            api_1.refCard.addUI(LoyaltyContainer);
            api_1.refCard.addCustomAction("Add 1 Loyalty", undefined, "add_one_loyalty");
            api_1.refCard.addCustomAction("Lose 1 Loyalty", undefined, "lose_one_loyalty");
            api_1.refCard.addCustomAction("Add 5 Loyalty", undefined, "add_five_loyalty");
            api_1.refCard.addCustomAction("Lose 5 Loyalty", undefined, "lose_five_loyalty");
        }
    }
    else if (layout === "saga") {
        // Show a nice chapter split ui
        const Name = easy_face.name ?? "";
        const Type_Line = easy_face.type_line ?? "";
        const Mana_Cost = easy_face.mana_cost ?? "NO MANA COST";
        const Oracle_Text = easy_face.oracle_text ?? "";
        const Canvas_Text = `${Name} :: ${Mana_Cost}\n${Type_Line} :: ${(easy_face.rarity ?? 'S').toUpperCase()}\n${Oracle_Text.replace(/\(/g, "[size=24][i](").replace(/\)/g, ")[/i][/size]")}`;
        RightBorder.setChild(new api_1.RichText().setText(Canvas_Text).setFontSize(24).setAutoWrap(true).setTextColor([0, 0, 0, 1])); //, 0, 0, 760, 1500);
    }
    else if (layout === "transform" && front && back) {
        // UI is different based on which side is face up.
        const Name = front.name ?? "";
        const Type_Line = front.type_line ?? "";
        const Mana_Cost = front.mana_cost ?? "NO MANA COST";
        const Oracle_Text = front.oracle_text ?? "";
        const Name_2 = back.name ?? "";
        const Type_Line_2 = back.type_line ?? "";
        const Mana_Cost_2 = back.mana_cost ?? "NO MANA COST";
        const Oracle_Text_2 = back.oracle_text ?? "";
        let use_l_d = front_face ? (front["type_line"].includes("Planeswalker") ? "pw" : front["type_line"].includes("Battle") ? "bt" : false) : back["type_line"].includes("Planeswalker") ? "pw" : back["type_line"].includes("Battle") ? "bt" : false;
        let use_l_d_f = front["type_line"].includes("Planeswalker") ? "pw" : front["type_line"].includes("Battle") ? "bt" : false;
        let use_l_d_b = back["type_line"].includes("Planeswalker") ? "pw" : back["type_line"].includes("Battle") ? "bt" : false;
        const Canvas_Text = `[color=${front_face ? "#000000" : "#777777"}]${Name} :: ${Mana_Cost}\n${Type_Line} :: ${(easy_face.rarity ?? 'S').toUpperCase()}\n${Oracle_Text.replace(/\(/g, "[size=24][i](").replace(/\)/g, ")[/i][/size]")}${use_l_d_f === "pw" ? "\nStarting Loyalty: " + front["loyalty"] : use_l_d_f === "bt" ? "\nStarting Defense: " + front["defense"] : ""}${front["type_line"].includes("Creature") || front["type_line"].includes("Vehicle") ? "\n" + front["power"] + "/" + front["toughness"] : ""}[/color]\n-------------------------\n[color=${front_face ? "#444444" : "#000000"}]${Name_2} :: ${Mana_Cost_2}\n${Type_Line_2} :: ${(easy_face.rarity ?? 'S').toUpperCase()}\n${Oracle_Text_2.replace(/\(/g, "[size=24][i](").replace(/\)/g, ")[/i][/size]")}${use_l_d_b === "pw" ? "\nStarting Loyalty: " + back["loyalty"] : use_l_d_b === "bt" ? "\nStarting Defense: " + back["defense"] : ""}${back["type_line"].includes("Creature") || back["type_line"].includes("Vehicle") ? "\n" + back["power"] + "/" + back["toughness"] : ""}[/color]`;
        RightBorder.setChild(new api_1.RichText().setText(Canvas_Text).setFontSize(24).setAutoWrap(true).setTextColor([0, 0, 0, 1])); //, 0, 0, 760, 1500);
        api_1.refCard.setTextureOverrideURL(front_face ? front.image_uris.normal.concat("&front_face=true") : back.image_uris.normal.concat("&front_face=false"));
        if (use_l_d) {
            api_1.refCard.addCustomAction("Add 1 " + (use_l_d === "pw" ? "Loyalty" : "Defense"), undefined, "add_one_loyalty");
            api_1.refCard.addCustomAction("Lose 1 " + (use_l_d === "pw" ? "Loyalty" : "Defense"), undefined, "lose_one_loyalty");
            api_1.refCard.addCustomAction("Add 5 " + (use_l_d === "pw" ? "Loyalty" : "Defense"), undefined, "add_five_loyalty");
            api_1.refCard.addCustomAction("Lose 5 " + (use_l_d === "pw" ? "Loyalty" : "Defense"), undefined, "lose_five_loyalty");
        }
        else {
            const loyaltyElement = api_1.refCard.getUIs().find((ui) => ui.position.equals(new api_1.Vector(-3.5, -2.13, -0.1), 1));
            const defenseElement = api_1.refCard.getUIs().find((ui) => ui.position.equals(new api_1.Vector(4.5, -2.4, -0.1), 1));
            if (!!loyaltyElement)
                api_1.refCard.removeUIElement(loyaltyElement);
            if (!!defenseElement)
                api_1.refCard.removeUIElement(defenseElement);
            const LoyaltyText = new api_1.Button();
            LoyaltyText.setFontSize(48);
            LoyaltyText.setText(`${use_l_d === "pw" ? (front_face ? front["loyalty"] : back["loyalty"]) : front_face ? front["defense"] : back["defense"]}`);
            LoyaltyText.onClicked.add(() => null);
            globalState.loyalty = parseInt((use_l_d === "pw" ? (front_face ? front["loyalty"] : back["loyalty"]) : front_face ? front["defense"] : back["defense"]) ?? '0');
            const LoyaltyContainer = new api_1.UIElement();
            LoyaltyContainer.width = 100;
            LoyaltyContainer.height = 100;
            LoyaltyContainer.useWidgetSize = false;
            LoyaltyContainer.zoomVisibility = api_1.UIZoomVisibility.Both;
            LoyaltyContainer.position = use_l_d === "bt" ? new api_1.Vector(4.5, -2.4, -0.1) : new api_1.Vector(-3.5, -2.13, -0.1);
            LoyaltyContainer.rotation = new api_1.Rotator(180, 180, 0);
            LoyaltyContainer.scale = 0.08;
            LoyaltyContainer.anchorX = 0;
            LoyaltyContainer.anchorY = 0;
            LoyaltyContainer.useTransparency = true;
            LoyaltyContainer.widget = LoyaltyText;
            globalState.loyaltyUI = LoyaltyText;
            api_1.refCard.addUI(LoyaltyContainer);
            api_1.refCard.removeCustomAction("add_one_loyalty");
            api_1.refCard.removeCustomAction("lose_one_loyalty");
            api_1.refCard.removeCustomAction("add_five_loyalty");
            api_1.refCard.removeCustomAction("lose_five_loyalty");
        }
        const LeftButton = new api_1.ImageButton();
        LeftButton.setImage("back-forth.png", api_1.refPackageId); // Icon created by Lorc, sourced from game-icons.net
        LeftButton.setImageSize(64, 0);
        LeftButton.onClicked.add(transformCard);
        LeftBorder.addChild(LeftButton);
    }
    if (!!easy_face["all_parts"] && easy_face["all_parts"].some((part) => part.component === "token")) {
        const TokenButton = new api_1.Button();
        TokenButton.setFontSize(24);
        TokenButton.setText("Tokens");
        TokenButton.onClicked.add(createTokens);
        LeftBorder.addChild(TokenButton);
    }
    if (!!easy_face["all_parts"] && !(easy_face.type_line ?? '').includes("Emblem") && easy_face["all_parts"].some((part) => part.type_line.includes("Emblem"))) {
        const EmblemButton = new api_1.Button();
        EmblemButton.setFontSize(24);
        EmblemButton.setText("Emblems");
        EmblemButton.onClicked.add(createTokens);
        LeftBorder.addChild(EmblemButton);
    }
    api_1.refCard.addCustomAction("Add 1 Stat Counter", undefined, "add_one_stat");
    api_1.refCard.addCustomAction("Lose 1 Stat Counter", undefined, "lose_one_stat");
    api_1.refCard.addCustomAction("Add 5 Stat Counters", undefined, "add_five_stat");
    api_1.refCard.addCustomAction("Lose 5 Stat Counters", undefined, "lose_five_stat");
    RightSide.widget = RightBorder;
    LeftSide.widget = LeftBorder;
    api_1.refCard.addUI(RightSide);
    api_1.refCard.addUI(LeftSide);
}
function generateCardDetails() {
    process.nextTick(() => {
        if (api_1.refCard.getStackSize() > 1)
            return;
        const [sf_id] = api_1.refCard.getCardDetails()?.textureOverrideURL?.match(/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}/g) ?? [];
        const [front_face] = api_1.refCard.getCardDetails()?.textureOverrideURL?.match(/(?<=&front_face=)(false|true)/g) ?? ["true"];
        if (sf_id !== undefined) {
            fetch(`https://api.scryfall.com/cards/${sf_id}`)
                .then((r) => r.json())
                .then((v) => {
                const { name, layout, mana_cost, cmc, type_line, oracle_text, power, toughness, rarity, card_faces, all_parts, loyalty } = v;
                // Remove unused properties. Max length of savedData is 1023 chars
                api_1.refCard.setName(name ?? "New Card");
                makeDetailedDescription(layout, { name, mana_cost, cmc, type_line, oracle_text, power, toughness, rarity, all_parts, loyalty }, card_faces, front_face === "true");
                api_1.refCard.onCustomAction.add(onCustomAction);
            });
        }
    });
}
const onCustomAction = (self, player, action_id) => {
    switch (action_id) {
        case "add_one_loyalty":
            globalState.loyalty = (globalState.loyalty ?? 0) + 1;
            break;
        case "lose_one_loyalty":
            globalState.loyalty = (globalState.loyalty ?? 0) - 1;
            break;
        case "add_five_loyalty":
            globalState.loyalty = (globalState.loyalty ?? 0) + 5;
            break;
        case "lose_five_loyalty":
            globalState.loyalty = (globalState.loyalty ?? 0) - 5;
            break;
        case "add_one_stat":
            globalState.stats = (globalState.stats ?? 0) + 1;
            break;
        case "lose_one_stat":
            globalState.stats = (globalState.stats ?? 0) - 1;
            break;
        case "add_five_stat":
            globalState.stats = (globalState.stats ?? 0) + 5;
            break;
        case "lose_five_stat":
            globalState.stats = (globalState.stats ?? 0) - 5;
            break;
        default:
            break;
    }
    globalState.statsUI?.setText(globalState.stats >= 0 ? `+${globalState.stats}/+${globalState.stats}` : `${globalState.stats}/${globalState.stats}`);
    if (globalState.stats !== 0)
        globalState.statsUI?.setVisible(true);
    else
        globalState.statsUI?.setVisible(false);
    globalState.loyaltyUI?.setText(`${globalState.loyalty}`);
};
