import { Chat } from "./chat.class";

export class Channel extends Chat {
    channelName: string;
    channelDescription: string;
    creatorOfChannel: string;

    constructor(data: any = {}) {
        super(data);
        this.channelName = data ? data.channelName : "";
        this.channelDescription = data ? data.channelDescription : "";
        this.creatorOfChannel =  data ? data.creatorChannel : "";; 
    }

    override toJSON() {
        return {
            id: this.id,
            channelName: this.channelName,
            channelDescription: this.channelDescription,
            creatorChannel: this.creatorOfChannel,
            messages: this.messages,
            users: this.users
        }
    }
}