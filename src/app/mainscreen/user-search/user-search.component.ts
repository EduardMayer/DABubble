import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { Message } from 'src/models/message.class';
import { User } from 'src/models/user.class';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent {

  _message: Message | undefined;
  showUserSearch = false;
  searchResultsUsers: User[] = [];
  clickListener: any;

  constructor(
    private userFirebaseService: UserFirebaseService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
  }


  @Input() set message(message: Message) {
    this._message = message;

    this.checkForAt();
    this.getUsers("");
  }

  @Output() userName: EventEmitter<User | boolean> = new EventEmitter<User | boolean>();




  checkForAt() {

    /*
    const cursorStart = this.getcursorStartPosition(); 
    if(cursorStart != undefined){
      this.inputFieldUserSearch.nativeElement.style.left = cursorStart + "px"; 
    }
    */
    if (this._message) {
      const messageArray: String[] = this._message.content.split(" ");
      let lastWord = messageArray[messageArray.length - 1];
      lastWord = lastWord.replaceAll("\n", "");
      if (lastWord.substring(0, 1) == "@") {
        const searchString = lastWord.substring(1, lastWord.length);
        //console.log("SearchString:" + searchString);
        if (searchString !== "") {
          this.showUserSearch = true;
          this.getUsers(searchString);
        }
        else {
          this.showUserSearch = true;
          this.searchResultsUsers = this.userFirebaseService.loadedUsers;
        }
      }
      else {
        this.showUserSearch = false;
        this.searchResultsUsers = [];
      }
    }
  }

  clickUser(index: number) {
    if (this._message) {
      this.userName.emit(this.searchResultsUsers[index]);
      //const name = this.searchResultsUsers[index].fullName
      //this._message.content += ;
    }
  }

  getUsers(searchString: string) {
    this.searchResultsUsers = [];
    this.userFirebaseService.loadedUsers.forEach(user => {
      if (user.fullName.toUpperCase().includes(searchString.toUpperCase())) {
        this.searchResultsUsers.push(user);
      }
    });
  }



  ngAfterViewInit() {
    // Get the native element of the emoji-mart component
    // Add a click event listener to the emoji-mart component
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      // Check if the event target is inside the emoji-mart element

      const userSearchField = this.renderer.selectRootElement('#inputFieldUserSearch');
      if (userSearchField.contains(event.target as Node)) {
        //Clicked inside emoji-mart element
        console.log('Clicked inside the User-Selector element');
      } else {
        //Clicked outside emoji-mart element
        console.log('Clicked outside the User-Selector element');
        this.userName.emit(false);
      }
    });
  }
}
