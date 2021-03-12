import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RegistrationModule } from './registration/registration.module';
import { DemoComponent } from './demo/demo.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, DemoComponent],
  imports: [
    BrowserModule,
    RegistrationModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '',
        component: DemoComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
