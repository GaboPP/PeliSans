import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedComponent } from './feed/feed.component';
import { HttpModule } from '@angular/http';
import { EntradasService } from './servicios/entradas.service';
import { CardComponent } from './card/card.component';
import { NavbarComponent } from './navbar/navbar.component';
import { InsertPeliComponent } from './insert-peli/insert-peli.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    CardComponent,
    NavbarComponent,
    InsertPeliComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    FormsModule
  ],
  providers: [EntradasService],
  bootstrap: [AppComponent]
})
export class AppModule { }
