/*
Made with 💜 by N0_.q3
Cleanified with ❤️‍🩹 by Vanitywya
I am not responsible for any damage caused by this plugin; use at your own risk
Vencord does not endorse/support this plugin (Works with Equicord as well)
dm @neoarz if u need help or have any questions
https://github.com/neoarz/NitroSniper
*/

import { Logger } from "@utils/Logger";

import { settings } from "./settings";
import { sendCaptchaReloadWebhook } from "./webhook";

const logger = new Logger("NitroSniper");

const POLL_INTERVAL_MS = 500;
const MIN_CAPTCHA_SIZE_PX = 50;

const CAPTCHA_IFRAME_SELECTORS = [
    'iframe[src*="hcaptcha.com"]',
    'iframe[src*="hcaptcha"]',
    'iframe[src*="recaptcha"]',
    'iframe[title*="captcha" i]'
];

let pollTimer: ReturnType<typeof setInterval> | null = null;
let captchaSeenAt: number | null = null;
let reloading = false;

function isVisibleCaptchaElement(element: Element) {
    const rect = element.getBoundingClientRect();
    if (rect.width < MIN_CAPTCHA_SIZE_PX || rect.height < MIN_CAPTCHA_SIZE_PX) return false;

    const style = window.getComputedStyle(element);
    return style.display !== "none"
        && style.visibility !== "hidden"
        && style.opacity !== "0";
}

function isCaptchaOnScreen() {
    for (const selector of CAPTCHA_IFRAME_SELECTORS) {
        for (const element of document.querySelectorAll(selector)) {
            if (isVisibleCaptchaElement(element)) return true;
        }
    }

    return false;
}

async function reloadForCaptcha(stuckSeconds: number) {
    if (reloading) return;

    reloading = true;
    logger.warn(`Captcha visible for ${stuckSeconds}s, reloading Discord...`);

    const webhookUrl = settings.store.webhookUrl.trim();
    if (webhookUrl) {
        try {
            await sendCaptchaReloadWebhook(webhookUrl, stuckSeconds);
        } catch (error) {
            logger.error("Failed to send captcha reload webhook", error);
        }
    }

    // Same as running `location.reload()` in Discord's DevTools console.
    window.location.reload();
}

function resetCaptchaTimer() {
    captchaSeenAt = null;
    reloading = false;
}

function tick() {
    if (!settings.store.captchaAutoReload) {
        resetCaptchaTimer();
        return;
    }

    const stuckMs = Math.max(1, settings.store.captchaStuckSeconds) * 1000;

    if (!isCaptchaOnScreen()) {
        resetCaptchaTimer();
        return;
    }

    if (captchaSeenAt === null) {
        captchaSeenAt = Date.now();
        return;
    }

    if (Date.now() - captchaSeenAt >= stuckMs) {
        void reloadForCaptcha(settings.store.captchaStuckSeconds);
    }
}

export function startCaptchaWatcher() {
    stopCaptchaWatcher();
    pollTimer = setInterval(tick, POLL_INTERVAL_MS);
}

export function stopCaptchaWatcher() {
    if (pollTimer !== null) {
        clearInterval(pollTimer);
        pollTimer = null;
    }

    resetCaptchaTimer();
}
