import { Message } from "./message.class";
import { User } from "./user.class";

export class Chat {
    id: string;
    messages: string[];
    users: string[];

    constructor(data?: any) {
        this.id = data.id || "";
        this.messages = data.messages || [];
        this.users = data.users || [];
    }

    toJSON() {
        return {
            id: this.id,
            messages: this.messages,
            users: this.users
        }
    }
}