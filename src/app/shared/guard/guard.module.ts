import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminGuardService, LoggedGuardService, PublicGuardService } from './can-activate-guard.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
  	AdminGuardService,
  	LoggedGuardService,
  	PublicGuardService
  ]
})
export class GuardModule { }
