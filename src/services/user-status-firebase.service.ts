import { Injectable, inject } from '@angular/core';
import { Database, onDisconnect, ref, set } from '@angular/fire/database';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserStatusFirebaseService {

  private database: Database = inject(Database);

  constructor() { }

 

  writeUserStatus(userId:string, status:string) {
    const userStatusDatabaseRef = ref(this.database, 'userStatus/' + userId);
  
    // Set the user's status
    set(userStatusDatabaseRef, {
      "status": status
    }).then(() => {
      // Add onDisconnect to set status to 'offline' when the user disconnects
      onDisconnect(userStatusDatabaseRef).set({
        "status": "offline"
      });
    });
  }


}
