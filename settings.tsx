/*
Made with ❤️ by neoarz
Edited with 💜 by N0_.q3
I am not responsible for any damage caused by this plugin; use at your own risk
Vencord does not endorse/support this plugin (Works with Equicord as well)
dm @neoarz if u need help or have any questions
https://github.com/neoarz/NitroSniper
*/

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";
import { Button, showToast, Toasts } from "@webpack/common";
import { sendTestWebhook } from "./webhook";

function getToastErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Failed to send test webhook.";
}

function TestWebhookButton() {
    const webhookUrl = settings.use(["webhookUrl"]).webhookUrl;
    const disabled = webhookUrl.trim().length === 0;
    return (
        <Button
            disabled={disabled}
            onClick={() =>
                void sendTestWebhook(webhookUrl)
                    .then(() => showToast("Test webhook sent successfully.", Toasts.Type.SUCCESS))
                    .catch((error: unknown) => showToast(getToastErrorMessage(error), Toasts.Type.FAILURE))
            }
        >
            Send Test Webhook
        </Button>
    );
}

export const settings = definePluginSettings({
    ignoreOwnGiftLinks: {
        type: OptionType.BOOLEAN,
        description: "Do not redeem Nitro gift links from messages sent by you.",
        default: false,
        restartNeeded: false,
    },
    enableCaptchaRefresher: {
        type: OptionType.BOOLEAN,
        description: "Refreshes discord if captcha detected.",
        default: false,
        restartNeeded: false,
    },
    captchaRefreshMs: {
        type: OptionType.NUMBER,
        description: "Time to refresh after captcha (ms).",
        default: 2000,
    },
    captchaCheckIntervalMs: {
        type: OptionType.NUMBER,
        description: "How often to check for a CAPTCHA on screen (ms).",
        default: 500,
    },
    webhookUrl: {
        type: OptionType.STRING,
        description: "Discord webhook URL to notify after each redeem attempt and captcha alerts. Leave empty to disable.",
        default: "",
        restartNeeded: false,
    },
    testWebhook: {
        type: OptionType.COMPONENT,
        description: "Send a test message to the configured webhook.",
        component: TestWebhookButton,
    },
});
