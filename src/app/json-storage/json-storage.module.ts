import { NgModule }       from '@angular/core';

import { JsonStorageService } from './json-storage.service';

@NgModule({
  providers: [
    JsonStorageService
  ]
})
export class JsonStorageModule {}
