import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AddChannelDialogComponent } from 'src/app/add-channel-dialog/add-channel-dialog.component';
import { ChannelFirebaseService } from 'src/services/channel-firebase.service';
import { UserFirebaseService } from 'src/services/user-firebase.service';
import { User } from 'src/models/user.class';
import { UserProfilService } from 'src/services/user-profil.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss', '../../../styles.scss']
})
export class SidenavComponent implements OnInit{

unpackChannels = false;
unpackMessages = false;
currentUser:User = new User(); 

  constructor(
      public dialog: MatDialog, 
      public channelFirebaseService: ChannelFirebaseService, 
      private userFirebaseService: UserFirebaseService, 
      private userProfilService: UserProfilService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.userFirebaseService.currentUser; 
  }


  showChannels() {
    if(this.unpackChannels == false) {
      this.unpackChannels = true;
    } else {
      this.unpackChannels = false;
    }
  }


  showMessages() {
    if(this.unpackMessages == false) {
      this.unpackMessages = true;
    } else {
      this.unpackMessages = false;
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddChannelDialogComponent, {
      //data: {name: this.name},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.animal = result;
    });
  }

  openUserProfil(user:User){
    this.userProfilService.openUserProfil(user); 
  }
}



  

  