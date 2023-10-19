export class Message {
    messageId: string;
    content: Message;
    timestamp: number;
    autor: string;

    constructor(obj?: any) {
        this.messageId = obj ? obj.messageId : "";
        this.content = obj ? obj.content : "";
        this.timestamp = obj ? obj.timestamp : 0;
        this.autor = obj ? obj.autor : "";
    }

    toJSON() {
        return {
            messageId: this.messageId,
            content: this.content,
            timestamp: this.timestamp,
            autor: this.autor
        }
    }
}