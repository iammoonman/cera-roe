function onLoad()
    self.interactable = false;
    self.createButton({
        click_function = 'untap_orange',
        label = "Untap",
        position = { x = -0.1, y = 0.17, z = -2.64 },
        rotation = { x = 0, y = 90, z = 0 },
        scale = { x = 0.1, y = 0.1, z = 0.1 },
        width = 375,
        color = { r = 0.75, g = 0.75, b = 0.75 },
    })
    self.createButton({
        click_function = 'untap_red',
        label = "Untap",
        position = { x = -0.1, y = 0.17, z = -1.51 },
        rotation = { x = 0, y = 90, z = 0 },
        scale = { x = 0.1, y = 0.1, z = 0.1 },
        width = 375,
        color = { r = 0.75, g = 0.75, b = 0.75 },
        tooltip = "",
    })
    self.createButton({
        click_function = 'untap_brown',
        label = "Untap",
        position = { x = -0.1, y = 0.17, z = -0.39 },
        rotation = { x = 0, y = 90, z = 0 },
        scale = { x = 0.1, y = 0.1, z = 0.1 },
        width = 375,
        color = { r = 0.75, g = 0.75, b = 0.75 },
        tooltip = "",
    })
    self.createButton({
        click_function = 'untap_white',
        label = "Untap",
        position = { x = -0.1, y = 0.17, z = 0.75 },
        rotation = { x = 0, y = 90, z = 0 },
        scale = { x = 0.1, y = 0.1, z = 0.1 },
        width = 375,
        color = { r = 0.75, g = 0.75, b = 0.75 },
        tooltip = "",
    })
    self.createButton({
        click_function = 'untap_pink',
        label = "Untap",
        position = { x = -0.1, y = 0.17, z = 1.88 },
        rotation = { x = 0, y = 90, z = 0 },
        scale = { x = 0.1, y = 0.1, z = 0.1 },
        width = 375,
        color = { r = 0.75, g = 0.75, b = 0.75 },
        tooltip = "",
    })
    self.createButton({
        click_function = 'untap_purple',
        label = "Untap",
        position = { x = 0.08, y = 0.17, z = 2.65 },
        rotation = { x = 0, y = 270, z = 0 },
        scale = { x = 0.1, y = 0.1, z = 0.1 },
        width = 375,
        color = { r = 0.75, g = 0.75, b = 0.75 },
        tooltip = "",
    })
    self.createButton({
        click_function = 'untap_blue',
        label = "Untap",
        position = { x = 0.08, y = 0.17, z = 1.51 },
        rotation = { x = 0, y = 270, z = 0 },
        scale = { x = 0.1, y = 0.1, z = 0.1 },
        width = 375,
        color = { r = 0.75, g = 0.75, b = 0.75 },
        tooltip = "",
    })
    self.createButton({
        click_function = 'untap_teal',
        label = "Untap",
        position = { x = 0.08, y = 0.17, z = 0.39 },
        rotation = { x = 0, y = 270, z = 0 },
        scale = { x = 0.1, y = 0.1, z = 0.1 },
        width = 375,
        color = { r = 0.75, g = 0.75, b = 0.75 },
        tooltip = "",
    })
    self.createButton({
        click_function = 'untap_green',
        label = "Untap",
        position = { x = 0.08, y = 0.17, z = -0.73 },
        rotation = { x = 0, y = 270, z = 0 },
        scale = { x = 0.1, y = 0.1, z = 0.1 },
        width = 375,
        color = { r = 0.75, g = 0.75, b = 0.75 },
        tooltip = "",
    })
    self.createButton({
        click_function = 'untap_yellow',
        label = "Untap",
        position = { x = 0.08, y = 0.17, z = -1.87 },
        rotation = { x = 0, y = 270, z = 0 },
        scale = { x = 0.1, y = 0.1, z = 0.1 },
        width = 375,
        color = { r = 0.75, g = 0.75, b = 0.75 },
        tooltip = "",
    })
end

function untap_purple()
    local zone = getObjectFromGUID('2470c2')
    local plane_rotation = 270
    for _, occupyingObject in ipairs(zone.getObjects(true)) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end

function untap_blue()
    local zone = getObjectFromGUID('dee3d3')
    local plane_rotation = 270
    for _, occupyingObject in ipairs(zone.getObjects(true)) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end

function untap_teal()
    local zone = getObjectFromGUID('178467')
    local plane_rotation = 270
    for _, occupyingObject in ipairs(zone.getObjects(true)) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end

function untap_green()
    local zone = getObjectFromGUID('a33ff2')
    local plane_rotation = 270
    for _, occupyingObject in ipairs(zone.getObjects(true)) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end

function untap_yellow()
    local zone = getObjectFromGUID('46dcdb')
    local plane_rotation = 270
    for _, occupyingObject in ipairs(zone.getObjects(true)) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end

function untap_orange()
    local zone = getObjectFromGUID('3a5415')
    local plane_rotation = 90
    for _, occupyingObject in ipairs(zone.getObjects(true)) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end

function untap_red()
    local zone = getObjectFromGUID('674a7e')
    local plane_rotation = 90
    for _, occupyingObject in ipairs(zone.getObjects(true)) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end

function untap_brown()
    local zone = getObjectFromGUID('c4bd9f')
    local plane_rotation = 90
    for _, occupyingObject in ipairs(zone.getObjects(true)) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end

function untap_white()
    local zone = getObjectFromGUID('ff2945')
    local plane_rotation = 90
    for _, occupyingObject in ipairs(zone.getObjects(true)) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end

function untap_pink()
    local zone = getObjectFromGUID('35f3ce')
    local plane_rotation = 90
    for _, occupyingObject in ipairs(zone.getObjects(true)) do
        if occupyingObject.type == "Card" then
            local rotation = occupyingObject.getRotation()
            local flip_angle = rotation.z
            occupyingObject.setRotation({ x = 0, y = plane_rotation, z = flip_angle })
        end
    end
end
