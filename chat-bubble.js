import {Settings} from './settings.js';

let keybindKeySet = 'v'                                             // configurable keybind

/**
 * Assign module settings
 */
function registerModuleSettings() {
    keybindKeySet = assignKeybind(game.settings.get('chat-bubble', 'userKeybindButton'));

};


/**
 * @param {String} key Keybind set by user
 */
function assignKeybind(key) {
    /**
     * keybinds ending with space are trimmed by 0.7.x settings window
     */
    if (key.endsWith("+")) {
        key = key + "  ";
    }
    return window.Azzu.SettingsTypes.KeyBinding.parse(key)
}

/* ------------------------------------ */
/* Initialize module		            */
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('ChatBubble | Initializing')
    CONFIG.debug.hooks = true
})

/* ------------------------------------ */
/* Setup module		                    */
/* ------------------------------------ */
Hooks.once('setup', function () {
    Settings.createSettings()
    registerModuleSettings()
})

Hooks.on("closeSettingsConfig", function() {
    registerModuleSettings()
});

document.addEventListener('keydown', event => {
    if (window.Azzu.SettingsTypes.KeyBinding.eventIsForBinding(event, keybindKeySet)) {
        console.log("TEST KEY BINDING")
        console.log(document.getElementById('player-list'))
        console.log(document.getElementById('player-list').getElementsByTagName("li"))
        let player_list = document.getElementById('player-list').getElementsByTagName("li")
        let i
        for (i=0; i<player_list.length; i++) {
            if (game.userId == player_list[i].dataset.userId) {
                console.log("TEST")
            }
        }
    }
});


// This is for chat styling
Hooks.on("renderChatMessage", (app, html, data) => {
    if (html.find(".hm_messageheal").length) {
        html.css("background", "#06a406");
        html.css("text-shadow", "-1px -1px 0 #000 , 1px -1px 0 #000 , -1px 1px 0 #000 , 1px 1px 0 #000");
        html.css("color", "white");
        html.css("text-align", "center");
        html.css("font-size", "12px");
        html.css("margin", "2px");
        html.css("padding", "2px");
        html.css("border", "2px solid #191813d6");
        // html.find(".message-sender").text("");
        // html.find(".message-metadata")[0].style.display = "none";
    }
    if (html.find(".hm_messagetaken").length) {
        html.css("background", "#c50d19");
        html.css("text-shadow", "-1px -1px 0 #000 , 1px -1px 0 #000 , -1px 1px 0 #000 , 1px 1px 0 #000");
        html.css("color", "white");
        html.css("text-align", "center");
        html.css("font-size", "12px");
        html.css("margin", "2px");
        html.css("padding", "2px");
        html.css("border", "2px solid #191813d6");
        // html.find(".message-sender").text("");
        // html.find(".message-metadata")[0].style.display = "none";
    }
});



