--By Amuzet
--Adapted by Moon
mod_name, version, url = 'Life_Tracker', 1.01, ''
function updateSave() self.script_state = JSON.encode({ ['c'] = count, ['subs'] = subs }) end

function wait(t)
    local s = os.time()
    repeat coroutine.yield(0) until os.time() > s + t
end

function updateCountDisplay(l, n) self.editButton({ index = 0, label = '\n' .. l .. '\n' .. (n and n > 0 and '+' .. n or n or '') }) end

function option(o, c, a)
    local n = 1
    if a then n = -n end
    click_changeValue(o, c, n)
end

function click_changeValue(obj, color, val)
    if color == owner or Player[color].admin then
        if previousCount == nil then
            previousCount = count
        end
        count = count + val
        updateCountDisplay(previousCount, count - previousCount)
        if debUpdate == nil then
            debUpdate = Wait.time(function()
                updateCountDisplay(count)
                if previousCount > count then
                    printToSome(txt:format('lost', math.abs(count - previousCount), count), self.getColorTint())
                else
                    printToSome(txt:format('gained', math.abs(count - previousCount), count), self.getColorTint())
                end
                debUpdate = nil
                previousCount = nil
            end, 3)
        else
            Wait.stop(debUpdate)
            debUpdate = Wait.time(function()
                updateCountDisplay(count)
                if previousCount > count then
                    printToSome(txt:format('lost', math.abs(count - previousCount), count), self.getColorTint())
                else
                    printToSome(txt:format('gained', math.abs(count - previousCount), count), self.getColorTint())
                end
                debUpdate = nil
                previousCount = nil
            end, 3)
        end
        updateSave()
    end
end

local lCheck = {
    ['everyone_loses_'] = function(n, c) return count - n, 'made everyone lose' end,
    ['opponents_lose_'] = function(n, c) if c ~= owner then return count - n else return count, 'opponents lost' end end,
    ['reset_life_'] = function(n, c) return n, 'reset Life totals to' end,
    ['double_my_life_'] = function(n, c) if c == owner then return count * 2 ^ n, 'doubled their life this many times' end end,
    ['set_life_'] = function(n, c) if c == owner then return n, 'Life total changed by ' .. math.abs(n - count) .. '. Setting it to' end end,
    ['drain_'] = function(n, c) if c == owner then return count + n, 'drained everyone for' else return count - n, false, true end end,
    ['extort_'] = function(n, c)
        if c == owner then
            for _, p in pairs(Player.getPlayers()) do if p.seated and p.color ~= owner and subs[p.color] then count = count + n end end
            return count, 'extorted everyone for'
        else
            return count - n, false, true
        end
    end,
    -- ['test_']=function(n,c)return count end,
}

function toggleColorSubscribe(c)
    subs[c] = not subs[c]
    if subs[c] then printToColor(c .. ' subscribed to ' .. self.getDescription(), c) else printToColor(c .. ' unsubscribed from ' .. self.getDescription(), c) end
end

function setColorSubscribe(c, isSub)
    subs[c] = isSub
    if isSub then printToColor(c .. ' subscribed to ' .. self.getDescription(), c) else printToColor(c .. ' unsubscribed from ' .. self.getDescription(), c) end
end

-- Use the turns counter by Jophire
-- Every once in a while, check each turn counter for whether this color's chip is on it
-- Subscribe each other player on that turn counter to this's updates

function printToSome(text, tint)
    for _, c in ipairs(Player.getColors()) do if subs[c] then pcall(function() printToColor(text, c, tint) end) end end
end

function onChat(msg, player)
    if msg:find('[ _]%d+') then
        if not subs[player.color] then return true end
        local m = msg:lower():gsub(' ', '_')
        local a, sl, t, n = false, false, '', tonumber(m:match('%d+'))

        for k, f in pairs(lCheck) do
            if m:find(k .. '%d+') then
                a, t, sl = f(n, player.color)
                if a then
                    if sl then updateCountDisplay(count) end
                    count = a
                    break
                else
                    return msg
                end
            end
        end

        updateSave()
        if t and t ~= '' then
            printToSome(player.color .. '[999999] ' .. t .. ' [-]' .. n, self.getColorTint())
            updateCountDisplay(count) -- , count - JSON.decode(self.script_state).c)
            return false
        end
    end
end

function onload(s)
    --Loads the tracking for if the game has started yet
    owner = self.getDescription()
    ref_type = self.getName():gsub('%s.+', '')
    txt = owner .. ' [888888]%s %s ' .. ref_type .. '.[-] |%s|'
    local clr = stringColorToRGB(owner)
    self.setColorTint(clr)
    if s ~= '' then
        local ld = JSON.decode(s); count = ld.c; subs = ld.subs
    else
        count = 0; subs = { White = owner == 'White' or owner == 'Blue', Blue = owner == 'White' or owner == 'Blue', Red = owner == 'Red' or owner == 'Green', Purple = owner == 'Purple' or owner == 'Pink', Pink = owner == 'Purple' or owner == 'Pink', Green = owner == 'Red' or owner == 'Green', Orange = owner == 'Orange' or owner == 'Yellow', Yellow = owner == 'Orange' or owner == 'Yellow', Teal = owner == 'Teal' or owner == 'Brown', Brown = owner == 'Teal' or owner == 'Brown' }
    end
    self.createButton({
        tooltip = 'Click to increase\nRight click to decrease',
        click_function = 'option',
        function_owner = self,
        label = '\n' .. count .. '\n',
        position = { -x, 0, 0 },
        scale = { 0.60, 1, 0.60 },
        height = 800,
        width = 2100,
        font_size = 2000,
        rotation = { 0, 90, 0 },
        color = g,
        font_color = clr
    })
    for i, v in ipairs({ { n = 1, l = '+', p = { 0, y, z } }, { n = -1, l = '-', p = { 0, y, -z } } }) do
        local fn = 'valueChange' .. i
        self.setVar(fn, function(o, c, a)
            local b = 1
            if a then b = 5 end
            click_changeValue(o, c, v.n * b)
        end)
        self.createButton({ tooltip = 'Right-click for ' .. v.n * 5, label = v.l, position = v.p, click_function = fn, function_owner = self, height = 500, width = 500, font_size = 700, rotation = { 0, 90, 0 }, color = g, font_color = clr })
    end
    for k, _ in pairs(lCheck) do
        local m = k:gsub('_', ' ') .. 'X'
        self.addContextMenuItem(m, function(p)
            if p ~= owner then return end
            mode = k
            self.createInput({ position = { -x * 2, y, 0 }, input_function = 'ipt', function_owner = self, tooltip = m .. ' Input\nOwner`s final edit will be used.', alignment = 3, validation = 2, width = 500, height = 323, font_size = 300, rotation = { 0, 90, 0 }, color = g, font_color = clr })
        end)
    end
    self.addContextMenuItem('Toggle Life Alerts', toggleColorSubscribe, false)
end

function ipt(o, p, v, s)
    if not s and p == owner then
        onChat(mode .. v, { color = p })
        self.clearInputs()
    end
end

mode, ref_type, owner, x, y, z, g, previousCount, debUpdate = '', '', '', 1.1, 0.2, 0.7, { 0.1, 0.1, 0.1 }, nil, nil
