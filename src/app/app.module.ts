import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//This import is needed for the template driven approach only.
//import { FormsModule } from '@angular/forms';
//This import is needed for the reactive approach only.
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    //FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
