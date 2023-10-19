export class Message {
    messageId: string;
    content: Message;
    timestamp: number;
    autorId: string;

    constructor(obj?: any) {
        this.messageId = obj ? obj.messageId : "";
        this.content = obj ? obj.content : "";
        this.timestamp = obj ? obj.timestamp : 0;
        this.autorId = obj ? obj.autorId : "";
    }

    toJSON() {
        return {
            messageId: this.messageId,
            content: this.content,
            timestamp: this.timestamp,
            autorId: this.autorId
        }
    }
}