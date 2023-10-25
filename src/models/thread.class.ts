import { Chat } from "./chat.class";

export class Thread extends Chat {
    refChannelId: string;

    constructor(data?: any) {
        super(data);
        this.refChannelId = data.refChannelId || "General";
    }

    override toJSON() {
        return {
            id: this.id,
            messages: this.messages,
            users: this.users,
            refChannelId: this.refChannelId
        }
    }
}