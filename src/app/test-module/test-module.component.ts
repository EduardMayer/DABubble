import { Component } from '@angular/core';

import { Channel } from 'src/models/channel.class';
import { User } from 'src/models/user.class';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { ThreadFirebaseService } from 'src/services/thread-firebase.service';
import { ChannelFirebaseService } from '../../services/channel-firebase.service';
import { Thread } from 'src/models/thread.class';
import { MessageFirebaseService } from 'src/services/message-firebase.service';
import { Message } from 'src/models/message.class';

@Component({
  selector: 'app-test-module',
  templateUrl: './test-module.component.html',
  styleUrls: ['./test-module.component.scss']
})
export class TestModuleComponent {

  channels: any[] | undefined;

  threads: any[] | undefined;
  //thread: Thread;

  users: any[] | undefined;
  user: User;

  constructor(
    public firebaseServiceChannel: ChannelFirebaseService, 
    public firebaseServiceUser: UserFirebaseService,
    public firebaseServiceThread: ThreadFirebaseService,
    public firebaseServiceMessage: MessageFirebaseService) {



    //CHANNEL EXAMPLE

    //GET DATA
    this.firebaseServiceThread.load();
    // -->Data Stored in this.firebaseServiceChannel.loadedChannels

    //UPDATE/CREATE DATA
    const thread = new Thread({
      "id": "",
      "refChannelId": "General",
      "messages": ["12312312222371", "123123123123", "askjdhasje3ui312", "pseudoIds"],
      "users": ["123123222123123", "askjdha222sje3ui312", "pseudoIds"]
    });

    //this.firebaseServiceThread.update(thread);


    //this.logRandomThread();

    const message= new Message({
      id:"",
      content: "first message",
      timestamp: 213123123,
      autorId: "randomUserId"
    })

    //this.firebaseServiceMessage.update(message);
    



    //USER EXAMPLE

    //GET DATA
    this.firebaseServiceUser.load();

    //UPDATE/CREATE DATA
    this.user = new User(
      {
        id: "ONU7LtimwEtSoaZJJuTX",
        firstName: "Frank",
        lastName: "White",
        mail: "ar@gmx.de",
        birthDate: "2000-03-17",
        street: "Teststrasse",
        zipCode: "12345",
        city: "HinterbachWest"
      }
    )

    //this.firebaseServiceUser.updateUserDoc(this.user);


  }

  logRandomThread(){
    this.firebaseServiceThread.getById("6ejabbzpRlUIfWzqEsjO");
    this.firebaseServiceThread.getById("Dv4FmZyNNrMbbtHo0Elz");
    setTimeout(()=>{
      console.log(this.firebaseServiceThread.loadedThread);
    },2000);
    
  }
}
