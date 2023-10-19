import { Chat } from "./chat.class";

export class Channel extends Chat {
    channelName: string;

    constructor(obj?: any) {
        super();
        this.channelName = obj ? obj.channelName : "";
    }

    override toJSON() {
        return {
            id: this.id,
            channelName: this.channelName,
            messages: this.messages,
            users: this.users
        }
    }
}