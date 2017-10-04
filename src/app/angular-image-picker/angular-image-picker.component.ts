import { Component, OnInit, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Image } from './../image'
import { Media } from './media.model'

@Component({
  selector: 'tzd-angular-image-picker',
  templateUrl: './angular-image-picker.component.html',
  styleUrls: ['./angular-image-picker.component.scss']
})
export class AngularImagePickerComponent implements OnInit {

  // File references
  public files: FileList;

  maxWidth = 1080;

  constructor() {}

  ngOnInit() {}

  // this methos is called by the html when the input file changes
  updateFilesToLoad() {
    this.files = (<HTMLInputElement>document.getElementById('files')).files;
  }
}
