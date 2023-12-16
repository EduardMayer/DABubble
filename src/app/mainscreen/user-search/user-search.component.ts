import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { User } from 'src/models/user.class';
import { UserFirebaseService } from 'src/services/user-firebase.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent {

  _searchValue: string = "";
  showUserSearch = false;
  searchResultsUsers: User[] = [];
  clickListener: any;

  constructor(
    private userService: UserFirebaseService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
  }

  @Input() set searchValue(value: string) {
    this._searchValue = value;
    this.getUsers(this._searchValue);
  }

  @Output() userName: EventEmitter<User | boolean> = new EventEmitter<User | boolean>();

  clickUser(index: number) {
      this.userName.emit(this.searchResultsUsers[index]);
  }

  getUsers(searchString: string) {
    this.searchResultsUsers = [];
    this.userService.loadedUsers.forEach(user => {
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

      const userSearchField = this.el.nativeElement.querySelector('.user-search');
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
