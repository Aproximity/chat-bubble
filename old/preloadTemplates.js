export const preloadTemplates = async function () {
    const templatePaths = [
        // Add paths to "modules/chatBubble/templates"
        'modules/chat-bubble/templates/chat-bubble-template.hbs'
    ]

    return loadTemplates(templatePaths)
}