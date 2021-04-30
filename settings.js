export class Settings {
    static createSettings() {
        // client setting
        game.settings.register("chat-bubble", "userKeybindButton", {
            name: "Keybind",                                    // Setting name
            hint: "Assign the additional keybind requirement to show an chat bubble when a key is pressed.",     // Setting description
            type: window.Azzu.SettingsTypes.KeyBinding,
            scope: "client",        // Client-stored setting
            config: true,           // Show setting in configuration view
            default: 'v',           // Default Value
        });
    }
}