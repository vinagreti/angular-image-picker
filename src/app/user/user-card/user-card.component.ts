import { Component, Input } from '@angular/core';
import { User, UserService } from './../';

@Component({
  selector: 'user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {

    @Input() user: User;

    constructor(
        public userService: UserService
    ) { }

    toggleAdmin($event, user){
        $event.stopPropagation();
        this.userService.toggleAdmin(user);
    }

}
