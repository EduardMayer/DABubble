import { Injectable, inject } from '@angular/core';
import { Channel } from 'src/models/channel.class';
import { Chat } from 'src/models/chat.class';

@Injectable({
    providedIn: 'root'
})
export class ActiveSelectionService {

    private activeSelectionType: string = ""; //Channel,Chat
    private activeSelectionObject: Chat | Channel | null | undefined = null;

    set activeSelection(selection: Chat | Channel | null | undefined ) {
        console.log(typeof selection );
        
        if (typeof selection == 'object') {
            if (selection instanceof Channel) {
                this.activeSelectionType = 'Channel';
                this.activeSelectionObject = selection;
            } else {
                this.activeSelectionType = 'Chat';
                this.activeSelectionObject = selection;
            }
        } else {
            this.activeSelectionType = "";
            this.activeSelectionObject = null;
        }

        console.log("SELECTION DONE: Selected Type: "+this.activeSelectionType);
        console.log("SELECTED DATA:");
        console.log(this.activeSelectionObject);
    }

    getActiveSelectionType(){
        return this.activeSelectionType;
    }

    getActiveSelectionObject(){
        return this.activeSelectionObject;
    }

}