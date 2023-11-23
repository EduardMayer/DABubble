import { Component } from '@angular/core';

@Component({
  selector: 'app-add-user-to-channel-dialog',
  templateUrl: './add-user-to-channel-dialog.component.html',
  styleUrls: ['./add-user-to-channel-dialog.component.scss']
})
export class AddUserToChannelDialogComponent {

  selectedOption: string = '';

chooseSelection() {
  console.log(this.selectedOption); // Gibt den aktuell ausgewählten Wert aus
}
}
