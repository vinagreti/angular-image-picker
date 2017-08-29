import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { UserLoginComponent } from './user-login/user-login.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserInsertComponent } from './user-insert/user-insert.component';

// Guard Services
import { AdminGuardService, LoggedGuardService, PublicGuardService } from './../shared/guard';

export const appRoutes: Routes = [
    { path: 'login', component: UserLoginComponent, canActivate: [PublicGuardService] },
    { path: 'insert', component: UserInsertComponent, canActivate: [AdminGuardService] },
    { path: ':id', component: UserEditComponent, canActivate: [AdminGuardService] },
    { path: '', component: UserListComponent, canActivate: [LoggedGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [
  ]
})

export class UserRoutingModule { }
