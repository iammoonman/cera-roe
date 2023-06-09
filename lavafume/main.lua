mod_name, version = 'Lavafume', 1.07
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
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
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
        ['dynt'] = 'roll'
    }
    local prevFunc = {
        ['roll'] = 'dynt',
        ['flip'] = 'roll',
        ['rd20'] = 'flip',
        ['mnrc'] = 'rd20',
        ['dynt'] = 'mnrc'
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
