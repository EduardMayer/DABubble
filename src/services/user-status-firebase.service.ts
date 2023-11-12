import { Injectable, OnInit, inject } from '@angular/core';
import { Database, get, onDisconnect, ref, set } from '@angular/fire/database';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserStatusFirebaseService {

  private database: Database = inject(Database);

  constructor() { }



  writeUserStatus(userId:string, status:string) {
    const userStatusDatabaseRef = ref(this.database, 'userStatus/' + userId);
    set(userStatusDatabaseRef, {
      "status": status
    }).then(() => {
      onDisconnect(userStatusDatabaseRef).set({
        "status": "offline"
      });
    });
  }

  getUserStatus(userId:string) {
    const userStatusDatabaseRef = ref(this.database, 'userStatus/' + userId);
    return get(userStatusDatabaseRef).then((snapshot) => {
      if (snapshot.exists()) {
        const status = snapshot.val().status;
        console.log(status);
        return status
      } else {
        return "Status not available"; // Or handle the absence of status as needed
      }
    }).catch((error) => {
      console.error("Error getting user status:", error);
      return "Error fetching status";
    });
  }



}
