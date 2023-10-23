import { Chat } from "./chat.class";

export class Channel extends Chat {
    channelName: string;

    constructor(data: any) {
        super(data);
        this.channelName = data ? data.channelName : "";
    }

    override toJSON() {

        let messagesAsString=this.messages.join();
        let usersAsString=this.users.join();

        return {
            id: this.id,
            channelName: this.channelName,
            messages: messagesAsString,
            users: usersAsString
        }
    }
}