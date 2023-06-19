mod_name, version = 'Lavafume', 1.0
gh_script, gh_ui  = 'https://raw.githubusercontent.com/iammoonman/cera-roe/main/lavafume/main.lua', 'https://raw.githubusercontent.com/iammoonman/cera-roe/main/lavafume/ui.xml'
reload_deb        = nil

function onLoad()
    self.interactable = false;
    WebRequest.get(gh_script, self, 'GetFreshScript')
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
    local color = IDToColor(button_id)
    for i, p in ipairs(Player.getPlayers()) do
        if p.host then p.broadcast(color .. ' needs assistance.') end
    end
end

function untap(player, _, button_id)
    local color = IDToColor(button_id)
    local guid = '5a1314'
    local plane_rotation = 270
    if color == 'Pink' then guid = '3a1115' plane_rotation = 90 end
    if color == 'White' then guid = '1a6ae3' plane_rotation = 90 end
    if color == 'Brown' then guid = 'dc830e' plane_rotation = 90 end
    if color == 'Red' then guid = 'd26b1c' plane_rotation = 90 end
    if color == 'Orange' then guid = '180cb4' plane_rotation = 90 end
    if color == 'Yellow' then guid = '16498f' plane_rotation = 270 end
    if color == 'Green' then guid = '428abc' plane_rotation = 270 end
    if color == 'Teal' then guid = 'ad990b' plane_rotation = 270 end
    if color == 'Blue' then guid = '2e1be7' plane_rotation = 270 end
    if color == 'Purple' then guid = '5a1314' plane_rotation = 270 end
    local zone = getObjectFromGUID(guid)
    for _, occupyingObject in ipairs(zone.getObjects(true)) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end

function g1(player, _, button_id)
    local button_a = 'g1_p'
    local button_b = 'g1_k'
    local color = IDToColor(button_id)
    if button_id == 'g1_p' or button_id == 'g1_k' then
        button_a = 'g1_k'
        button_b = 'g1_p'
    elseif button_id == 'g1_w' or button_id == 'g1_u' then
        button_a = 'g1_w'
        button_b = 'g1_u'
    elseif button_id == 'g1_b' or button_id == 'g1_t' then
        button_a = 'g1_b'
        button_b = 'g1_t'
    elseif button_id == 'g1_r' or button_id == 'g1_g' then
        button_a = 'g1_r'
        button_b = 'g1_g'
    elseif button_id == 'g1_o' or button_id == 'g1_y' then
        button_a = 'g1_o'
        button_b = 'g1_y'
    end
    if self.UI.getAttribute(button_id, 'outline') ~= color then
        self.UI.setAttributes(button_a, color)
        self.UI.setAttributes(button_b, color)
    else
        self.UI.setAttributes(button_a, '')
        self.UI.setAttributes(button_b, '')
    end
end

function g2(player, _, button_id)
    local button_a = 'g2_p'
    local button_b = 'g2_k'
    local color = IDToColor(button_id)
    if button_id == 'g2_p' or button_id == 'g2_k' then
        button_a = 'g2_k'
        button_b = 'g2_p'
    elseif button_id == 'g2_w' or button_id == 'g2_u' then
        button_a = 'g2_w'
        button_b = 'g2_u'
    elseif button_id == 'g2_b' or button_id == 'g2_t' then
        button_a = 'g2_b'
        button_b = 'g2_t'
    elseif button_id == 'g2_r' or button_id == 'g2_g' then
        button_a = 'g2_r'
        button_b = 'g2_g'
    elseif button_id == 'g2_o' or button_id == 'g2_y' then
        button_a = 'g2_o'
        button_b = 'g2_y'
    end
    if self.UI.getAttribute(button_id, 'outline') ~= color then
        self.UI.setAttributes(button_a, color)
        self.UI.setAttributes(button_b, color)
    else
        self.UI.setAttributes(button_a, '')
        self.UI.setAttributes(button_b, '')
    end
end

function g3(player, _, button_id)
    local button_a = 'g3_p'
    local button_b = 'g3_k'
    local color = IDToColor(button_id)
    if button_id == 'g3_p' or button_id == 'g3_k' then
        button_a = 'g3_k'
        button_b = 'g3_p'
    elseif button_id == 'g3_w' or button_id == 'g3_u' then
        button_a = 'g3_w'
        button_b = 'g3_u'
    elseif button_id == 'g3_b' or button_id == 'g1_t' then
        button_a = 'g3_b'
        button_b = 'g3_t'
    elseif button_id == 'g3_r' or button_id == 'g3_g' then
        button_a = 'g3_r'
        button_b = 'g3_g'
    elseif button_id == 'g3_o' or button_id == 'g3_y' then
        button_a = 'g3_o'
        button_b = 'g3_y'
    end
    if self.UI.getAttribute(button_id, 'outline') ~= color then
        self.UI.setAttributes(button_a, color)
        self.UI.setAttributes(button_b, color)
    else
        self.UI.setAttributes(button_a, '')
        self.UI.setAttributes(button_b, '')
    end
end

function flip(player, _, button_id)
    local color = IDToColor(button_id)
    local result = 'Tails'
    if math.random(0, 100) > 50 then
        result = 'Heads'
    end
    broadcastToAll(color .. " flipped " .. result .. '.', color)
end

function roll(player, _, button_id)
    local color = IDToColor(button_id)
    local result = math.random(1, 6)
    broadcastToAll(color .. " rolled a d6 and got " .. result .. '.', color)
end

function IDToColor(id)
    local id = id:match('_(%l)')
    if id == 'k' then return 'Pink' end
    if id == 'w' then return 'White' end
    if id == 'b' then return 'Brown' end
    if id == 'r' then return 'Red' end
    if id == 'o' then return 'Orange' end
    if id == 'y' then return 'Yellow' end
    if id == 'g' then return 'Green' end
    if id == 't' then return 'Teal' end
    if id == 'u' then return 'Blue' end
    if id == 'p' then return 'Purple' end
    return ''
end
