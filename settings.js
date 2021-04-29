export const registerSettings = function () {
    // client setting
    game.settings.register("chat-bubble", "userKeybindButton", {
        name: "Keybind",                                    // Setting name
        hint: "Assign the additional keybind requirement to show an chat bubble when a key is pressed.",     // Setting description
        type: window.Azzu.SettingsTypes.KeyBinding,
        scope: "client",        // Client-stored setting
        config: true,           // Show setting in configuration view
        default: 'v',           // Default Value
    });

    // client setting
    game.settings.register("chat-bubble", "userImagePosition", {
        name: "Position of bubble",                                                                    // Setting name
        hint: "Set the location of the image on the screen (per user).",      // Setting description
        scope: "client",          // Client-stored setting
        config: true,             // Show setting in configuration view
        choices: {                // Choices
            "Bottom left": "Bottom left",
            "Bottom right": "Bottom right",
            "Top left": "Top left",
            "Top right": "Top right"
        },
        default: "Top right",   // Default Value
        type: String              // Value type
    });

    // client setting
    game.settings.register("chat-bubble", "userImageSize", {
        name: "Image to monitor width",                                    // Setting name
        hint: "Changes the size of the image (per user), smaller value implies larger image (1/value of your screen width).",     // Setting description
        scope: "client",        // Client-stored setting
        config: true,           // Show setting in configuration view
        range: {                // Choices
            min: 3,
            max: 20,
            step: 0.5
        },
        default: 7,             // Default Value
        type: Number            // Value type
    });
}