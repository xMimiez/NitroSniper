export interface ClaimRequest {
    code: string;
    authorId?: string;
    authorName?: string;
    authorUsername?: string;
    channelId?: string;
    guildId?: string;
    messageId?: string;
}

export interface FinderProfile {
    name: string;
    iconUrl?: string;
}

export type WebhookResult = "claimed" | "failed";

export interface WebhookField {
    name: string;
    value: string;
    inline?: boolean;
}

export interface WebhookEmbed {
    title: string;
    color: number;
    description?: string;
    fields?: WebhookField[];
    timestamp: string;
    author?: {
        name: string;
        icon_url?: string;
    };
    footer?: {
        text: string;
    };
}

export interface WebhookPayload {
    username: string;
    embeds: WebhookEmbed[];
    allowed_mentions: {
        parse: string[];
    };
}

export interface NativeWebhookResponse {
    status: number;
    data: string;
}
