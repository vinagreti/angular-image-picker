import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable()
export class ValidatorService {

  constructor() { }

  requiredIf(condition: boolean) {
      return (control: FormControl): { [s: string]: boolean } => {
          if(condition){
              return control.value ? null : { required: true };
          } else {
              return null;
          }
      }
  }

}
