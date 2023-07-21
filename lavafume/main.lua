mod_name, version = 'Lavafume', 1.08
gh_script, gh_ui  = 'https://raw.githubusercontent.com/iammoonman/cera-roe/main/lavafume/main.lua', 'https://raw.githubusercontent.com/iammoonman/cera-roe/main/lavafume/ui.xml'
IDToColor         = { ['k'] = 'Pink', ['w'] = 'White', ['b'] = 'Brown', ['r'] = 'Red', ['o'] = 'Orange', ['y'] = 'Yellow', ['g'] = 'Green', ['t'] = 'Teal', ['u'] = 'Blue', ['p'] = 'Purple' }
mnrcState         = { ['k'] = '', ['w'] = '', ['b'] = '', ['r'] = '', ['o'] = '', ['y'] = '', ['g'] = '', ['t'] = '', ['u'] = '', ['p'] = '' }
dyntState         = { ['k'] = '', ['w'] = '', ['b'] = '', ['r'] = '', ['o'] = '', ['y'] = '', ['g'] = '', ['t'] = '', ['u'] = '', ['p'] = '' }
dayColor          = 'Yellow'
nightColor        = 'Red'
noColor           = ''

function onLoad(s)
    self.interactable = false;
    WebRequest.get(gh_script, self, 'GetFreshScript')
    if s ~= '' then
        local state = JSON.decode(s)
        mnrcState = state.mnrcState
        dyntState = state.dyntState
    end
end

function onSave()
    return JSON.encode({mnrcState = mnrcState, dyntState = dyntState})
end

function GetFreshScript(wr)
    if wr == nil then return end
    local v = wr.text:match('mod_name, version = \'Lavafume\', (%d+%p%d+)')
    log('GITHUB Version ' .. v)
    if v then v = tonumber(v) else v = version end
    if version < v then
        self.setLuaScript(wr.text)
        self.reload()
    end
    WebRequest.get(gh_ui, self, 'GetFreshXML')
end

function GetFreshXML(wr)
    if wr == nil then return end
    self.UI.setXml(wr.text)
end

function ping(player, _, button_id)
    local color = IDToColor[button_id:match('_(%l)')]
    for i, p in ipairs(Player.getPlayers()) do
        if p.host then p.broadcast(color .. ' needs assistance.') end
    end
end

function untap(player, _, button_id)
    local color = IDToColor[button_id:match('_(%l)')]
    local guid = '5a1314'
    local plane_rotation = 270
    if color == 'Pink' then guid = '6b2479' plane_rotation = 180 end
    if color == 'White' then guid = 'ed8834' plane_rotation = 180 end
    if color == 'Brown' then guid = '1451b7' plane_rotation = 180 end
    if color == 'Red' then guid = '2c271a' plane_rotation = 180 end
    if color == 'Orange' then guid = '00a854' plane_rotation = 180 end
    if color == 'Yellow' then guid = '6c87b2' plane_rotation = 0 end
    if color == 'Green' then guid = 'fd020e' plane_rotation = 0 end
    if color == 'Teal' then guid = '90ea3b' plane_rotation = 0 end
    if color == 'Blue' then guid = '6180e9' plane_rotation = 0 end
    if color == 'Purple' then guid = '7058c4' plane_rotation = 0 end
    local zone = getObjectFromGUID(guid)
    for _, occupyingObject in ipairs(zone.getObjects()) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotationSmooth({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end

function g1(player, _, button_id)
    local button_a = 'g1_k'
    local button_b = 'g1_p'
    local color = IDToColor[button_id:match('_(%l)')]
    if button_id == 'g1_p' or button_id == 'g1_k' then button_a = 'g1_k' button_b = 'g1_p'
    elseif button_id == 'g1_w' or button_id == 'g1_u' then button_a = 'g1_w' button_b = 'g1_u'
    elseif button_id == 'g1_b' or button_id == 'g1_t' then button_a = 'g1_b' button_b = 'g1_t'
    elseif button_id == 'g1_r' or button_id == 'g1_g' then button_a = 'g1_r' button_b = 'g1_g'
    elseif button_id == 'g1_o' or button_id == 'g1_y' then button_a = 'g1_o' button_b = 'g1_y'
    end
    if self.UI.getAttribute(button_id, 'outline') ~= color then
        self.UI.setAttribute(button_a, 'outline', color)
        self.UI.setAttribute(button_b, 'outline', color)
    else
        self.UI.setAttribute(button_a, 'outline', noColor)
        self.UI.setAttribute(button_b, 'outline', noColor)
    end
end

function g2(player, _, button_id)
    local button_a = 'g2_p'
    local button_b = 'g2_k'
    local color = IDToColor[button_id:match('_(%l)')]
    if button_id == 'g2_p' or button_id == 'g2_k' then button_a = 'g2_k' button_b = 'g2_p'
    elseif button_id == 'g2_w' or button_id == 'g2_u' then button_a = 'g2_w' button_b = 'g2_u'
    elseif button_id == 'g2_b' or button_id == 'g2_t' then button_a = 'g2_b' button_b = 'g2_t'
    elseif button_id == 'g2_r' or button_id == 'g2_g' then button_a = 'g2_r' button_b = 'g2_g'
    elseif button_id == 'g2_o' or button_id == 'g2_y' then button_a = 'g2_o' button_b = 'g2_y'
    end
    if self.UI.getAttribute(button_id, 'outline') ~= color then
        self.UI.setAttribute(button_a, 'outline', color)
        self.UI.setAttribute(button_b, 'outline', color)
    else
        self.UI.setAttribute(button_a, 'outline', noColor)
        self.UI.setAttribute(button_b, 'outline', noColor)
    end
end

function g3(player, _, button_id)
    local button_a = 'g3_p'
    local button_b = 'g3_k'
    local color = IDToColor[button_id:match('_(%l)')]
    if button_id == 'g3_p' or button_id == 'g3_k' then button_a = 'g3_k' button_b = 'g3_p'
    elseif button_id == 'g3_w' or button_id == 'g3_u' then button_a = 'g3_w' button_b = 'g3_u'
    elseif button_id == 'g3_b' or button_id == 'g3_t' then button_a = 'g3_b' button_b = 'g3_t'
    elseif button_id == 'g3_r' or button_id == 'g3_g' then button_a = 'g3_r' button_b = 'g3_g'
    elseif button_id == 'g3_o' or button_id == 'g3_y' then button_a = 'g3_o' button_b = 'g3_y'
    end
    if self.UI.getAttribute(button_id, 'outline') ~= color then
        self.UI.setAttribute(button_a, 'outline', color)
        self.UI.setAttribute(button_b, 'outline', color)
    else
        self.UI.setAttribute(button_a, 'outline', noColor)
        self.UI.setAttribute(button_b, 'outline', noColor)
    end
end

function flip(player, _, button_id)
    local color = IDToColor[button_id:match('_(%l)')]
    local result = 'Tails'
    if math.random(0, 100) > 50 then
        result = 'Heads'
    end
    broadcastToAll(color .. " flipped " .. result .. '.', color)
end

function roll(player, _, button_id)
    local color = IDToColor[button_id:match('_(%l)')]
    local result = math.random(1, 6)
    broadcastToAll(color .. " rolled a d6 and got " .. result .. '.', color)
end

function rd20(player, _, button_id)
    local color = IDToColor[button_id:match('_(%l)')]
    local result = math.random(1, 20)
    broadcastToAll(color .. " rolled a d20 and got " .. result .. '.', color)
end

function mnrc(player, _, button_id)
    local button_a = 'p'
    local button_b = 'k'
    local short = button_id:match('_(%l)')
    local color = IDToColor[short]
    if short == 'p' or short == 'k' then button_a = 'k' button_b = 'p'
    elseif short == 'w' or short == 'u' then button_a = 'w' button_b = 'u'
    elseif short == 'b' or short == 't' then button_a = 'b' button_b = 't'
    elseif short == 'r' or short == 'g' then button_a = 'r' button_b = 'g'
    elseif short == 'o' or short == 'y' then button_a = 'o' button_b = 'y'
    end
    if self.UI.getAttribute('btn_' .. short, 'outline') ~= color then
        if self.UI.getAttribute('btn_' .. button_a, 'onClick') == 'mnrc' then
            self.UI.setAttribute('btn_' .. button_a, 'outline', color)
        end
        if self.UI.getAttribute('btn_' .. button_b, 'onClick') == 'mnrc' then
            self.UI.setAttribute('btn_' .. button_b, 'outline', color)
        end
        mnrcState[button_a] = color
        mnrcState[button_b] = color
    else
        if self.UI.getAttribute('btn_' .. button_a, 'onClick') == 'mnrc' then
            self.UI.setAttribute('btn_' .. button_a, 'outline', noColor)
        end
        if self.UI.getAttribute('btn_' .. button_b, 'onClick') == 'mnrc' then
            self.UI.setAttribute('btn_' .. button_b, 'outline', noColor)
        end
        mnrcState[button_a] = noColor
        mnrcState[button_b] = noColor
    end
end

---@param player any
---@param value '-1' | '-2'
---@param button_id string
function dynt(player, value, button_id)
    local button_a = 'p'
    local button_b = 'k'
    local short = button_id:match('_(%l)')
    if short == 'p' or short == 'k' then button_a = 'k' button_b = 'p'
    elseif short == 'w' or short == 'u' then button_a = 'w' button_b = 'u'
    elseif short == 'b' or short == 't' then button_a = 'b' button_b = 't'
    elseif short == 'r' or short == 'g' then button_a = 'r' button_b = 'g'
    elseif short == 'o' or short == 'y' then button_a = 'o' button_b = 'y'
    end
    if dyntState[short] == nightColor then
        if self.UI.getAttribute('btn_' .. button_a, 'onClick') == 'dynt' then
            self.UI.setAttribute('btn_' .. button_a, 'outline', dayColor)
        end
        if self.UI.getAttribute('btn_' .. button_b, 'onClick') == 'dynt' then
            self.UI.setAttribute('btn_' .. button_b, 'outline', dayColor)
        end
        dyntState[button_a] = dayColor
        dyntState[button_b] = dayColor
    elseif dyntState[short] == dayColor then
        if self.UI.getAttribute('btn_' .. button_a, 'onClick') == 'dynt' then
            self.UI.setAttribute('btn_' .. button_a, 'outline', nightColor)
        end
        if self.UI.getAttribute('btn_' .. button_b, 'onClick') == 'dynt' then
            self.UI.setAttribute('btn_' .. button_b, 'outline', nightColor)
        end
        dyntState[button_a] = nightColor
        dyntState[button_b] = nightColor
    elseif value == '-1' then
        if self.UI.getAttribute('btn_' .. button_a, 'onClick') == 'dynt' then
            self.UI.setAttribute('btn_' .. button_a, 'outline', dayColor)
        end
        if self.UI.getAttribute('btn_' .. button_b, 'onClick') == 'dynt' then
            self.UI.setAttribute('btn_' .. button_b, 'outline', dayColor)
        end
        dyntState[button_a] = dayColor
        dyntState[button_b] = dayColor
    elseif value == '-2' then
        if self.UI.getAttribute('btn_' .. button_a, 'onClick') == 'dynt' then
            self.UI.setAttribute('btn_' .. button_a, 'outline', noColor)
        end
        if self.UI.getAttribute('btn_' .. button_b, 'onClick') == 'dynt' then
            self.UI.setAttribute('btn_' .. button_b, 'outline', noColor)
        end
        dyntState[button_a] = noColor
        dyntState[button_b] = noColor
    end
end

function swap(player, _, button_id)
    local pId = button_id:match('_(%l)')
    local dir = button_id:match('s(%u)_%l') -- N or P
    local curr = self.UI.getAttribute('btn_' .. pId, 'onClick')
    local nextFunc = {
        ['roll'] = 'flip',
        ['flip'] = 'rd20',
        ['rd20'] = 'mnrc',
        ['mnrc'] = 'dynt',
        ['dynt'] = 'layt',
        ['layt'] = 'roll'
    }
    local prevFunc = {
        ['roll'] = 'layt',
        ['flip'] = 'roll',
        ['rd20'] = 'flip',
        ['mnrc'] = 'rd20',
        ['dynt'] = 'mnrc',
        ['layt'] = 'dynt'
    }
    local func = prevFunc
    if dir == 'N' then
        func = nextFunc
    end
    self.UI.setAttribute('btn_' .. pId, 'onClick', func[curr])
    self.UI.setAttribute('btn_' .. pId, 'icon', func[curr])
    if func[curr] == 'mnrc' then
        self.UI.setAttribute('btn_' .. pId, 'outline', mnrcState[pId])
    elseif func[curr] == 'dynt' then
        self.UI.setAttribute('btn_' .. pId, 'outline', dyntState[pId])
    else
        self.UI.setAttribute('btn_' .. pId, 'outline', noColor)
    end
end

function layt(player, value, button_id)
    local pId = button_id:match('_(%l)')
    -- Hardcoded positions of library zones
    local libraries = { p = { 64.02259, 4.377451, 13.24275 }, k = { 40.84833, 4.377451, -13.30888 }, w = { 12.9248, 4.377451, -13.32137 }, b = { -14.99426, 4.377451, -13.31943 }, r = { -42.91833, 4.377451, -13.3373 }, o = { -70.83037, 4.377451, -13.31797 }, y = { -47.63555, 4.377451, 13.2475 }, g = { -19.71588, 4.377451, 13.24803 }, t = { 8.197245, 4.377451, 13.26315 }, u = { 36.1164, 4.377451, 13.25679 } }
    local deck = nil
    local hits = Physics.cast({ origin = libraries[pId], type = 1, direction = { 0, 1, 0 }, max_distance = 3 })
    for _, h in ipairs(hits) do
        if h.hit_object.type == 'Deck' then
            deck = h.hit_object
        end
    end
    if deck == nil then
        printToColor('Place a deck in your library slot.', player.color)
        return
    end
    local pos_starting = { x = 0, y = 0, z = 0 }
    local zone_guid = '5a1314'
    if pId == 'k' then zone_guid = '6b2479' end
    if pId == 'w' then zone_guid = 'ed8834' end
    if pId == 'b' then zone_guid = '1451b7' end
    if pId == 'r' then zone_guid = '2c271a' end
    if pId == 'o' then zone_guid = '00a854' end
    if pId == 'y' then zone_guid = '6c87b2' end
    if pId == 'g' then zone_guid = 'fd020e' end
    if pId == 't' then zone_guid = '90ea3b' end
    if pId == 'u' then zone_guid = '6180e9' end
    if pId == 'p' then zone_guid = '7058c4' end
    local zn = getObjectFromGUID(zone_guid)
    pos_starting = zn.getPosition()
    pos_starting:setAt('x', pos_starting.x - 10.35)
    if pId:match('p|u|t|g|y') then
        pos_starting:setAt('z', pos_starting.z - 7)
    else
        pos_starting:setAt('z', pos_starting.z + 7)
    end

    -- Returns the first card alphabetically by name
    function findNextCardIndex()
        local orderList = {}
        for _, card in ipairs(deck.getObjects()) do
            if card.nickname ~= "" then
                local insertTable = { name = card.nickname, index = card.index }
                table.insert(orderList, insertTable)
            end
        end
        -- Sort ordered list
        local sort_func = function(a, b) return a["name"] > b["name"] end
        table.sort(orderList, sort_func)
        -- Add no-names onto start
        for _, card in ipairs(deck.getObjects()) do
            if card.nickname == "" then
                local insertTable = { name = card.nickname, index = card.index }
                table.insert(orderList, 1, insertTable)
            end
        end
        return orderList[1].index
    end

    -- Placement
    local face_down = deck.is_face_down
    local wid = deck.getBoundsNormalized().size.x + 0.1
    local hgt = deck.getBoundsNormalized().size.z + 0.1
    local lastCard = nil
    local rowStep, colStep = 0, 0
    for _ = 1, 50 do
        local pos_local = {
            x = pos_starting.x + wid * colStep,
            y = pos_starting.y,
            z = pos_starting.z - hgt * rowStep,
        }
        colStep = colStep + 1
        if colStep > 9 then
            colStep = 0
            rowStep = rowStep + 1
        end
        if lastCard == nil then
            -- Handles most cards
            local nextIndex = findNextCardIndex()
            deck.takeObject({ position = pos_local, flip = face_down, index = nextIndex })
            lastCard = deck.remainder
        else
            -- Handles the leftover card
            lastCard.setPosition(pos_local)
            if face_down then lastCard.flip() end
        end
        if deck == nil then break end
    end
end
