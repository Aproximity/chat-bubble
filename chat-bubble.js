async function preRequisitesReady() {
    return Promise.all([areSettingsLoaded(), isCanvasReady()]);
}

async function areSettingsLoaded() {
    return new Promise(resolve => {
        Hooks.once('chatBubbleSettingsReady', resolve);
    });
}
async function isCanvasReady() {
    return new Promise(resolve => {
        Hooks.once('ready', resolve);
    });
}


function addCursorHiderBehavior() {
    const hiddenUsers = new Set();
    patchControlsLayer(hiddenUsers);

    Net.onUserHidden((userId) => {
        addHiddenUser(hiddenUsers, userId);
    });

    Net.onUserShown((userId) => {
        deleteHiddenUser(hiddenUsers, userId);
    });
    window.addEventListener('keydown', (e) => {
        if (isAnElementFocused()) {
            return;
        }

        const KeyBinding = window.Azzu.SettingsTypes.KeyBinding;
        const binding = Settings.toggleCursor;
        const noPermission = !binding;
        if (noPermission || !KeyBinding.eventIsForBinding(e, binding)) {
            return;
        }

        if (hiddenUsers.has(game.user._id)) {
            showCursor(hiddenUsers);
        } else {
            hideCursor(hiddenUsers);
        }
    });
    Hooks.on('renderPlayerList', (playerList, $html, data) => {
        hiddenUsers.forEach((userId) => {
            const styles = `flex:0 0 17px;width:17px;height:16px;border:0`;
            const src = `modules/chat-bubble/chatBubble.png`;
            const alt = `I want to speak`;
            const img = `<img style="${styles}" src="${src}" alt="${alt}" title="${alt}" />`;
            $html.find(`[data-user-id="${userId}"]`).append(img);
        });
    });
    setInterval(() => {
        if (hiddenUsers.has(game.user._id)) {
            Net.hideCursor();
        }
    }, 5000);

    if (Settings.hideByDefault) {
        hideCursor(hiddenUsers);
    }
}


function isAnElementFocused() {
    return !!$(':focus').length;
}

function hideCursor(hiddenUsers) {
    Net.hideCursor();
    addHiddenUser(hiddenUsers, game.user._id);
}

function showCursor(hiddenUsers) {
    Net.showCursor();
    deleteHiddenUser(hiddenUsers, game.user._id);
}

function addHiddenUser(hiddenUsers, userId) {
    hiddenUsers.add(userId);
    ui.players.render();
}
function deleteHiddenUser(hiddenUsers, userId) {
    hiddenUsers.delete(userId);
    ui.players.render();
}


class Net {
    static get SOCKET_NAME() {
        return 'module.chat-bubble';
    }

    static _emit(...args) {
        game.socket.emit(Net.SOCKET_NAME, ...args)
    }

    static hideCursor() {
        Net._emit({
            cmd: 'hideBubble',
            userId: game.user._id
        });
    }

    static showCursor() {
        Net._emit({
            cmd: 'showBubble',
            userId: game.user._id
        });
    }

    static onUserHidden(func) {
        game.socket.on(Net.SOCKET_NAME, (data) => {
            if (data.cmd !== 'hideBubble') return;
            func(data.userId);
        });
    }

    static onUserShown(func) {
        game.socket.on(Net.SOCKET_NAME, (data) => {
            if (data.cmd !== 'showBubble') return;
            func(data.userId);
        });
    }

    static broadcastCursorPos() {
        canvas.controls._onMoveCursor({data: {
                getLocalPosition() { return getMousePos(); }
            }});
    }
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

window.Azzu = window.Azzu || {};
const [Settings] = await preRequisitesReady();

addCursorHiderBehavior();


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



