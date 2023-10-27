import { Chat } from "./chat.class";

export class Channel extends Chat {
    channelName: string;
    channelDescription: string;
    creatorChannel: string;

    constructor(data: any = {}) {
        super(data);
        this.channelName = data ? data.channelName : "";
        this.channelDescription = data ? data.channelDescription : "";
        this.creatorChannel = data ? data.creatorChannel : "";
    }

    override toJSON() {
        return {
            id: this.id,
            channelName: this.channelName,
            channelDescription: this.channelDescription,
            creatorChannel: this.creatorChannel,
            messages: this.messages,
            users: this.users
        }
    }
}