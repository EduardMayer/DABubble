import { Injectable, OnInit, inject } from '@angular/core';
import { Database, get, onDisconnect, ref, set } from '@angular/fire/database';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserStatusFirebaseService {

  private database: Database = inject(Database);

  constructor() { }

  /**
   * Creates or updates user status and set it offline on disconnect. 
   * @param userId - unique user id
   * @param status - status of user - e.g. "online", "offline". 
   */
  async writeUserStatus(userId:string, status:string) {
    
    const userStatusDatabaseRef = ref(this.database, 'userStatus/' + userId);
    set(userStatusDatabaseRef, {
      "status": status
    }).then(() => {
      onDisconnect(userStatusDatabaseRef).set({
        "status": "offline"
      });
    })
    .catch((error) => {
      console.error("Status could not set");
    });
  }

  /**
   * Returns the current user status for a given user id. 
   * @param userId - unique user id
   * @returns Promise<string> - current user status
   */
  getUserStatus(userId:string) {
    const userStatusDatabaseRef = ref(this.database, 'userStatus/' + userId);
    return get(userStatusDatabaseRef).then((snapshot) => {
      if (snapshot.exists()) {
        const status = snapshot.val().status;
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
