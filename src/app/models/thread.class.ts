import { Chat } from "./chat.class";
import { Message } from "./message.class";
import { User } from "./user.class";


export class Threads extends Chat {
    refChannelId: string;

    constructor(obj?: any) {
        super();
        this.refChannelId = obj ? obj.refChannelId : "";
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