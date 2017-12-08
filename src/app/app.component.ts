import { Component, OnInit } from '@angular/core';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Angular Image Picker Demo';

  constructor(
    public userService: UserService
  ){
    console.info('App STARTED');
  }

  ngOnInit(){

  }

}
