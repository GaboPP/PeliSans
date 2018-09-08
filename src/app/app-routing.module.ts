import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { InsertPeliComponent} from './insert-peli/insert-peli.component';

const routes: Routes = [
  { path: '', component: FeedComponent },
  { path: 'entradas/new', component: InsertPeliComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
