import { Component } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AddChannelDialogComponent } from 'src/app/add-channel-dialog/add-channel-dialog.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss', '../../../styles.scss']
})
export class SidenavComponent {

unpackChannels = false;
unpackMessages = false;

constructor(public dialog: MatDialog) {}


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
  }



  

  