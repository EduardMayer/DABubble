import { Message } from "./message.class";
import { User } from "./user.class";

export class Chat {
    id: string;
    messages: Array<Message>;
    users: Array<User>;

    constructor(obj?: any) {
        this.id = obj ? obj.threadId : "";
        this.messages = obj ? obj.messages : [];
        this.users = obj ? obj.messages : [];

    }

    toJSON() {
        return {
            id: this.id,
            messages: this.messages,
            users: this.users
        }
    }
}