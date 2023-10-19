import { Chat } from "./chat.class";

export class Threads extends Chat {
    channelName: string;

    constructor(obj?: any) {
        super();
        this.channelName = obj ? obj.refChannelId : "";
    }

    override toJSON() {
        return {
            id: this.id,
            refChannelId: this.channelName,
            messages: this.messages,
            users: this.users
        }
    }
}