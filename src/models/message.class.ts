import { Reaction } from "./reaction.class";

export class Message {
    id: string;
    content: string;
    timestamp: number;
    autorId: string;
    avatarSrc: string;
    reactions: Reaction[];

    constructor(obj?: any) {
        this.id = obj ? obj.id : "";
        this.content = obj ? obj.content : "";
        this.timestamp = obj ? obj.timestamp : 0;
        this.autorId = obj ? obj.autorId : "";
        this.avatarSrc = obj ? obj.avatarSrc : "";
        this.reactions = obj ? obj.reactions : [];
    }

    toJSON() {
        return {
            id: this.id,
            content: this.content,
            timestamp: this.timestamp,
            autorId: this.autorId,
            avatarSrc: this.avatarSrc,
            reactions: this.reactions
        }
    }


    //TBD iterates throught array an searches if Reaction exists
    getReactionId(reactionName: string){
        return null;
    }
}