import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { HttpService } from './http.service';

import { AgmCoreModule } from '@agm/core';
import { LocationComponent } from './location/location.component';

import { AgmDirectionModule } from 'agm-direction';
import { HomeComponent } from './home/home.component' 

@NgModule({
  declarations: [
    AppComponent,
    LocationComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBz3URWxKvUHyX1N9k3RW5XkxEuyv0v62E'
    }),
    AgmDirectionModule,
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { 
  // constructor() { }
}






