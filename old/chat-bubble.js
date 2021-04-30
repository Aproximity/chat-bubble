import {Settings} from './settings.js';
import {preloadTemplates} from "./preloadTemplates.js";


let keybindKeySet = 'v'                                             // configurable keybind
let imagePositionSetting = "Bottom left";                           // location of character art
let imageSizeSetting = 7;                                           // size of character art

/**
 * Assign module settings
 */
function registerModuleSettings() {
    keybindKeySet = assignKeybind(game.settings.get('chat-bubble', 'userKeybindButton'));
    imageSizeSetting = game.settings.get('chat-bubble', 'userImageSize');
    imagePositionSetting = game.settings.get('chat-bubble', 'userImagePosition');
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


class ChatBubbleOverlay extends BasePlaceableHUD {
    static get defaultOptions () {
        const options = super.defaultOptions
        options.classes = [...super.defaultOptions.classes, 'chat-bubble']
        options.template = 'modules/chat-bubble/templates/chat-bubble-template.hbs'
        options.id = 'chatBubble'
        return options
    }

    /**
     * Get image data for html templates
     */
    getData () {
        const data = super.getData()
        data.url = 'https://foundryvtt-data-app.s3.eu-west-3.amazonaws.com/chat.png'
        return data
    }
}


class ChatBubble {
    token
    constructor () {
        canvas.hud.ChatBubble = new ChatBubbleOverlay()
        this.token = game.actors.get(game.user.data.character).getActiveTokens()[0]
        this.initHooks()
    }

    initHooks () {
        /**
         * add event listener when keybind setting is activated
         */
        document.addEventListener('keydown', event => {
            if (window.Azzu.SettingsTypes.KeyBinding.eventIsForBinding(event, keybindKeySet)) {
                console.log("TEST KEY BINDING")
                console.log(game.actors.get(game.user.data.character).getActiveTokens())
                this._handleOverlay(this.token)
            }
        });

        Hooks.on('deleteToken', (...args) => {
            canvas.hud.ChatBubble.clear()
        })

        Hooks.on('updateToken', (scene, token, ...args) => {
            canvas.hud.ChatBubble.update()
        })
    }

    _handleOverlay (token) {
        if (!token){
            console.error(`Chat Bubble | No token available.`);
            return;
        } else {
            console.log(canvas.hud.ChatBubble)
            canvas.hud.ChatBubble.bind(token)
        }
    }
}

/* ------------------------------------ */
/* Initialize module		            */
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('ChatBubble | Initializing')
    CONFIG.debug.hooks = true
    await preloadTemplates()

    /**
     * Add Image Hover display to html on load.
     * Note: Fix hack - reconfigure and create a new sibling to the current hud element.
     */
    Hooks.on("renderHeadsUpDisplay", (app, html, data) => {
        html.append(`<template id="chat-bubble"></template>`);
    });
})

/* ------------------------------------ */
/* Setup module		                    */
/* ------------------------------------ */
Hooks.once('setup', function () {
    Settings.createSettings()
    registerModuleSettings()
})

/* ------------------------------------ */
/* When ready		                    */
/* ------------------------------------ */
Hooks.once('ready', function () {
    // Do anything once the module is ready
    new ChatBubble()
})

Hooks.on("closeSettingsConfig", function() {
    registerModuleSettings()
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



