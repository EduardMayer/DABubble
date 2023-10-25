import { Chat } from "./chat.class";

export class Channel extends Chat {
    channelName: string;

    constructor(data: any) {
        super(data);
        this.channelName = data ? data.channelName : "";
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