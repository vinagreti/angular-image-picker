import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidatorService } from './validator.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [ValidatorService]
})
export class ValidatorModule { }
