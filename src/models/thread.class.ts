import { Chat } from "./chat.class";

export class Thread extends Chat {
    refChannelId: string;

    constructor(data?: any) {
        super(data);
        this.refChannelId = data.refChannelId || "General";
    }

    override toJSON() {

        let messagesAsString=JSON.stringify(this.messages);
        let usersAsString=JSON.stringify(this.users);

        return {
            id: this.id,
            messages: messagesAsString,
            users: usersAsString,
            refChannelId: this.refChannelId
        }
    }
}