package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"strings"

	// "net/http"

	scryfall "github.com/BlueMonday/go-scryfall"
	// "github.com/gin-gonic/gin"
)

const RotatedViewAngleScript = "function onLoad()self.alt_view_angle=Vector(180,0,90)end"
const FlippedViewAngleScript = "function onLoad()self.alt_view_angle=Vector(180,0,180)end"

type Objects struct {
	ObjectStates []TTSCard
}

type Transform struct {
	scaleX float32
	scaleY float32
	scaleZ float32
}

type Card struct {
	FaceURL      string
	BackURL      string
	NumWidth     int
	NumHeight    int
	BackIsHidden bool
	UniqueBack   bool
}

type TTSCard struct {
	Name        string
	Transform   Transform
	CardID      int
	Nickname    string
	Description string
	Memo        string
	LuaScript   string `json:"LuaScript,omitempty"`
	CustomDeck  map[string]Card
	States      map[string]TTSCard
}

type TTSDeck struct {
	Name             string
	Transform        Transform
	DeckIDs          []int
	ContainedObjects []TTSCard
}

func OracleTexter(s string) string {
	s = strings.Replace(s, "(", "[i](", -1)
	s = strings.Replace(s, ")", ")[/i]", -1)
	return s
}
func RarityTexter(s string) string {
	switch s {
	case "common":
		return "[ffffff]⌈C⌋[-]"
	case "uncommon":
		return "[6c848c]⌈U⌋[-]"
	case "rare":
		return "[c5b37c]⌈R⌋[-]"
	case "mythic":
		return "[f64800]⌈M⌋[-]"
	case "special":
		return "[905d98]⌈S⌋[-]"
	case "bonus":
		return "[9c202b]⌈B⌋[-]"
	default:
		return "[9c202b]⌈B⌋[-]"
	}
}

func NewDeck(TTSCards []TTSCard) TTSDeck {
	var w = TTSDeck{Name: "Deck", Transform: Transform{scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0}, DeckIDs: []int{}, ContainedObjects: TTSCards}
	for i := 0; i < len(TTSCards); i++ {
		w.DeckIDs = append(w.DeckIDs, 100)
	}
	return w
}

func (d *TTSDeck) AddCard(TTSCard TTSCard) {
	d.ContainedObjects = append(d.ContainedObjects, TTSCard)
	d.DeckIDs = append(d.DeckIDs, TTSCard.CardID)
}

func (d *TTSDeck) AddCards(TTSCards []TTSCard) {
	d.ContainedObjects = append(d.ContainedObjects, TTSCards...)
	for i := 0; i < len(TTSCards); i++ {
		d.DeckIDs = append(d.DeckIDs, TTSCards[i].CardID)
	}
}

func NewCard(c scryfall.Card) TTSCard {
	var ttscard = TTSCard{
		Name:        "Card",
		Transform:   Transform{scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0},
		CardID:      100,
		Nickname:    "",
		Description: "",
		Memo:        "",
		LuaScript:   "",
		CustomDeck: map[string]Card{
			"100": {FaceURL: "", BackURL: "https://i.imgur.com/TyC0LWj.jpg", NumWidth: 1, NumHeight: 1, BackIsHidden: true, UniqueBack: false},
		},
		States: map[string]TTSCard{},
	}
	// if len(c.OracleID) == 0 {
	// 	ttscard.Memo = c.CardFaces[0].OracleID
	// } else {
	ttscard.Memo = c.OracleID
	// }
	if c.Layout == scryfall.LayoutNormal || c.Layout == scryfall.LayoutLeveler || c.Layout == scryfall.LayoutMeld || c.Layout == scryfall.LayoutSaga || c.Layout == scryfall.LayoutToken || c.Layout == scryfall.LayoutHost || c.Layout == scryfall.LayoutAugment || c.Layout == scryfall.LayoutEmblem {
		var descriptionbuffer bytes.Buffer
		descriptionbuffer.WriteString(fmt.Sprintf("[b]%s %s[/b]\n%s %s\n%s", c.Name, c.ManaCost, c.TypeLine, RarityTexter(c.Rarity), OracleTexter(c.OracleText)))
		if c.Power != nil {
			descriptionbuffer.WriteString(fmt.Sprintf("\n%s/%s", *c.Power, *c.Toughness))
		}
		if c.Loyalty != nil {
			descriptionbuffer.WriteString(fmt.Sprintf("\nLoyalty: %s", *c.Loyalty))
		}
		ttscard.Description = descriptionbuffer.String()
		var namebuffer bytes.Buffer
		namebuffer.WriteString(fmt.Sprintf("%s\n%s %dMV", c.Name, c.TypeLine, uint8(c.CMC)))
		ttscard.Nickname = namebuffer.String()
		if entry, ok := ttscard.CustomDeck["100"]; ok {
			entry.FaceURL = c.ImageURIs.Normal
			ttscard.CustomDeck["100"] = entry
		}
	}
	if c.Layout == scryfall.LayoutSplit {
		var descriptionbuffer bytes.Buffer
		descriptionbuffer.WriteString(fmt.Sprintf("[b]%s %s[/b]\n%s %s\n%s", c.CardFaces[0].Name, c.CardFaces[0].ManaCost, c.CardFaces[0].TypeLine, RarityTexter(c.Rarity), OracleTexter(*c.CardFaces[0].OracleText)))
		descriptionbuffer.WriteString(fmt.Sprintf("\n[b]%s %s[/b]\n%s %s\n%s", c.CardFaces[1].Name, c.CardFaces[1].ManaCost, c.CardFaces[1].TypeLine, RarityTexter(c.Rarity), OracleTexter(*c.CardFaces[1].OracleText)))
		ttscard.Description = descriptionbuffer.String()
		var namebuffer bytes.Buffer
		namebuffer.WriteString(fmt.Sprintf("%s\n%s %dMV", c.Name, c.TypeLine, uint8(c.CMC)))
		ttscard.LuaScript = RotatedViewAngleScript
		ttscard.Nickname = namebuffer.String()
		if entry, ok := ttscard.CustomDeck["100"]; ok {
			entry.FaceURL = c.ImageURIs.Normal
			ttscard.CustomDeck["100"] = entry
		}
	}
	if c.Layout == scryfall.LayoutFlip {
		var frontdescriptionbuffer bytes.Buffer
		frontdescriptionbuffer.WriteString(fmt.Sprintf("[b]%s %s[/b]\n%s %s\n%s", c.CardFaces[0].Name, c.CardFaces[0].ManaCost, c.CardFaces[0].TypeLine, RarityTexter(c.Rarity), OracleTexter(*c.CardFaces[0].OracleText)))
		if c.CardFaces[0].Power != nil && c.CardFaces[0].Toughness != nil {
			frontdescriptionbuffer.WriteString(fmt.Sprintf("\n%s/%s", *c.CardFaces[0].Power, *c.CardFaces[0].Toughness))
		}
		var backdescriptionbuffer bytes.Buffer
		backdescriptionbuffer.WriteString(fmt.Sprintf("[b]%s %s[/b]\n%s %s\n%s", c.CardFaces[1].Name, c.CardFaces[1].ManaCost, c.CardFaces[1].TypeLine, RarityTexter(c.Rarity), OracleTexter(*c.CardFaces[1].OracleText)))
		if c.CardFaces[1].Power != nil && c.CardFaces[1].Toughness != nil {
			backdescriptionbuffer.WriteString(fmt.Sprintf("\n%s/%s", *c.CardFaces[1].Power, *c.CardFaces[1].Toughness))
		}
		var namebuffer bytes.Buffer
		namebuffer.WriteString(fmt.Sprintf("%s\n%s %fMV", c.Name, c.TypeLine, c.CMC))
		ttscard.Nickname = namebuffer.String()
		if strings.Contains(c.CardFaces[0].TypeLine, "Battle") {
			ttscard.LuaScript = RotatedViewAngleScript
		}
		if entry, ok := ttscard.CustomDeck["100"]; ok {
			entry.FaceURL = c.ImageURIs.Normal
			ttscard.CustomDeck["100"] = entry
		}
		ttscard.Description = fmt.Sprintf("%s\n[6E6E6E]%s[-]", frontdescriptionbuffer.String(), backdescriptionbuffer.String())
		ttscard.States["2"] = TTSCard{
			Name:        "Card",
			Transform:   Transform{scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0},
			CardID:      100,
			Nickname:    namebuffer.String(),
			Description: fmt.Sprintf("[6E6E6E]%s[-]\n%s", frontdescriptionbuffer.String(), backdescriptionbuffer.String()),
			Memo:        c.OracleID,
			LuaScript:   FlippedViewAngleScript,
			CustomDeck: map[string]Card{
				"100": {
					FaceURL:      c.ImageURIs.Normal,
					BackURL:      "https://i.imgur.com/TyC0LWj.jpg",
					NumWidth:     1,
					NumHeight:    1,
					BackIsHidden: true,
					UniqueBack:   false,
				},
			},
		}
	}
	if c.Layout == scryfall.LayoutTransform || c.Layout == scryfall.LayoutDoubleFacedToken || c.Layout == scryfall.LayoutModalDFC {
		var frontdescriptionbuffer bytes.Buffer
		frontdescriptionbuffer.WriteString(fmt.Sprintf("[b]%s %s[/b]\n%s %s\n%s", c.CardFaces[0].Name, c.CardFaces[0].ManaCost, c.CardFaces[0].TypeLine, RarityTexter(c.Rarity), OracleTexter(*c.CardFaces[0].OracleText)))
		if c.CardFaces[0].Power != nil && c.CardFaces[0].Toughness != nil {
			frontdescriptionbuffer.WriteString(fmt.Sprintf("\n%s/%s", *c.CardFaces[0].Power, *c.CardFaces[0].Toughness))
		}
		if c.CardFaces[0].Loyalty != nil {
			frontdescriptionbuffer.WriteString(fmt.Sprintf("\nLoyalty: %s", *c.CardFaces[0].Loyalty))
		}
		// if c.CardFaces[0].Defense != nil {
		// 	frontdescriptionbuffer.WriteString(fmt.Sprintf("\nDefense: %s", *c.CardFaces[0].Defense))
		// }
		var backdescriptionbuffer bytes.Buffer
		backdescriptionbuffer.WriteString(fmt.Sprintf("[b]%s %s[/b]\n%s %s\n%s", c.CardFaces[1].Name, c.CardFaces[1].ManaCost, c.CardFaces[1].TypeLine, RarityTexter(c.Rarity), OracleTexter(*c.CardFaces[1].OracleText)))
		if c.CardFaces[1].Power != nil && c.CardFaces[1].Toughness != nil {
			backdescriptionbuffer.WriteString(fmt.Sprintf("\n%s/%s", *c.CardFaces[1].Power, *c.CardFaces[1].Toughness))
		}
		if c.CardFaces[1].Loyalty != nil {
			backdescriptionbuffer.WriteString(fmt.Sprintf("\nLoyalty: %s", *c.CardFaces[1].Loyalty))
		}
		// if c.CardFaces[0].Defense != nil {
		// 	frontdescriptionbuffer.WriteString(fmt.Sprintf("\nDefense: %s", *c.CardFaces[0].Defense))
		// }
		var namebuffer bytes.Buffer
		namebuffer.WriteString(fmt.Sprintf("%s\n%s %dMV", c.Name, c.TypeLine, uint8(c.CMC)))
		ttscard.Nickname = namebuffer.String()
		if strings.Contains(c.CardFaces[0].TypeLine, "Battle") {
			ttscard.LuaScript = RotatedViewAngleScript
		}
		if entry, ok := ttscard.CustomDeck["100"]; ok {
			entry.FaceURL = c.CardFaces[0].ImageURIs.Normal
			ttscard.CustomDeck["100"] = entry
		}
		ttscard.Description = fmt.Sprintf("%s\n[6E6E6E]%s[-]", frontdescriptionbuffer.String(), backdescriptionbuffer.String())
		ttscard.States["2"] = TTSCard{
			Name:        "Card",
			Transform:   Transform{scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0},
			CardID:      100,
			Nickname:    namebuffer.String(),
			Description: fmt.Sprintf("[6E6E6E]%s[-]\n%s", frontdescriptionbuffer.String(), backdescriptionbuffer.String()),
			Memo:        c.OracleID,
			LuaScript:   "",
			CustomDeck: map[string]Card{
				"100": {
					FaceURL:      c.CardFaces[1].ImageURIs.Normal,
					BackURL:      "https://i.imgur.com/TyC0LWj.jpg",
					NumWidth:     1,
					NumHeight:    1,
					BackIsHidden: true,
					UniqueBack:   false,
				},
			},
		}
	}
	if c.Layout == scryfall.LayoutAdventure {
		var descriptionbuffer bytes.Buffer
		descriptionbuffer.WriteString(fmt.Sprintf("[b]%s %s[/b]\n%s %s\n%s", c.CardFaces[0].Name, c.CardFaces[0].ManaCost, c.CardFaces[0].TypeLine, RarityTexter(c.Rarity), OracleTexter(*c.CardFaces[0].OracleText)))
		if c.Power != nil && c.Toughness != nil {
			descriptionbuffer.WriteString(fmt.Sprintf("\n%s/%s", *c.Power, *c.Toughness))
		}
		descriptionbuffer.WriteString(fmt.Sprintf("[b]%s %s[/b]\n%s %s\n%s", c.CardFaces[1].Name, c.CardFaces[1].ManaCost, c.CardFaces[1].TypeLine, RarityTexter(c.Rarity), OracleTexter(*c.CardFaces[1].OracleText)))
		ttscard.Description = descriptionbuffer.String()
		var namebuffer bytes.Buffer
		namebuffer.WriteString(fmt.Sprintf("%s\n%s %dMV", c.Name, c.TypeLine, uint8(c.CMC)))
		ttscard.Nickname = namebuffer.String()
		if entry, ok := ttscard.CustomDeck["100"]; ok {
			entry.FaceURL = c.ImageURIs.Normal
			ttscard.CustomDeck["100"] = entry
		}
	}
	// if c.Layout == scryfall.LayoutClass {}
	// if c.Layout == scryfall.LayoutCase {}
	// if c.Layout == scryfall.LayoutMutate {}
	// if c.Layout == scryfall.LayoutPrototype {}
	// if c.Layout == scryfall.LayoutBattle {}
	if c.Layout == scryfall.LayoutPlanar {
		var descriptionbuffer bytes.Buffer
		descriptionbuffer.WriteString(fmt.Sprintf("[b]%s %s[/b]\n%s %s\n%s", c.Name, c.ManaCost, c.TypeLine, RarityTexter(c.Rarity), OracleTexter(c.OracleText)))
		ttscard.Description = descriptionbuffer.String()
		var namebuffer bytes.Buffer
		namebuffer.WriteString(fmt.Sprintf("%s\n%s %dMV", c.Name, c.TypeLine, uint8(c.CMC)))
		ttscard.Nickname = namebuffer.String()
		ttscard.LuaScript = RotatedViewAngleScript
		if entry, ok := ttscard.CustomDeck["100"]; ok {
			entry.FaceURL = c.ImageURIs.Normal
			ttscard.CustomDeck["100"] = entry
		}
	}
	if c.Layout == scryfall.LayoutScheme {
		var descriptionbuffer bytes.Buffer
		descriptionbuffer.WriteString(fmt.Sprintf("[b]%s %s[/b]\n%s %s\n%s", c.Name, c.ManaCost, c.TypeLine, RarityTexter(c.Rarity), OracleTexter(c.OracleText)))
		ttscard.Description = descriptionbuffer.String()
		var namebuffer bytes.Buffer
		namebuffer.WriteString(fmt.Sprintf("%s\n%s %dMV", c.Name, c.TypeLine, uint8(c.CMC)))
		ttscard.Nickname = namebuffer.String()
		if entry, ok := ttscard.CustomDeck["100"]; ok {
			entry.FaceURL = c.ImageURIs.Normal
			ttscard.CustomDeck["100"] = entry
		}
	}
	if c.Layout == scryfall.LayoutVanguard {
		var descriptionbuffer bytes.Buffer
		descriptionbuffer.WriteString(fmt.Sprintf("[b]%s %s[/b]\n%s %s\n%s", c.Name, c.ManaCost, c.TypeLine, RarityTexter(c.Rarity), OracleTexter(c.OracleText)))
		descriptionbuffer.WriteString(fmt.Sprintf("\nHand Modifier: %s\nLife Modifier: %s", *c.HandModifier, *c.LifeModifier))
		ttscard.Description = descriptionbuffer.String()
		var namebuffer bytes.Buffer
		namebuffer.WriteString(fmt.Sprintf("%s\n%s %dMV", c.Name, c.TypeLine, uint8(c.CMC)))
		ttscard.Nickname = namebuffer.String()
		if entry, ok := ttscard.CustomDeck["100"]; ok {
			entry.FaceURL = c.ImageURIs.Normal
			ttscard.CustomDeck["100"] = entry
		}
	}
	if c.Layout == scryfall.LayoutArtSeries {
	}
	// if c.Layout == scryfall.LayoutReversible {}
	return ttscard
}

// func getStuff(c *gin.Context) {
// 	c.IndentedJSON(http.StatusOK, "")
// }

func main() {
	ctx := context.Background()
	client, err := scryfall.NewClient()
	if err != nil {
		log.Fatal(err)
	}
	sco := scryfall.SearchCardsOptions{}
	result, err := client.SearchCards(ctx, "aberrantresearcher", sco)
	if err != nil {
		log.Fatal(err)
	}
	for i := 0; i < len(result.Cards); i++ {
		log.Printf("%s", NewCard(*&result.Cards[i]).Description)
	}
	// router := gin.Default()
	// router.GET("/", getStuff)
	// router.GET("/playground", getStuff) // There's also a JSON representation for stuff here.
	// router.GET("/simulator", getStuff)  // Returns full JSON string for spawning an object. Pass directly into spawnObjectData.
	// router.Run("localhost:8080")
}
