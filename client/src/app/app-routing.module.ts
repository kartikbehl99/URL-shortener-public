import { NotFoundComponent } from './not-found/not-found.component';
import { UrlRedirectingService } from './url-redirecting.service';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: ':short_url',
    component: HomeComponent,
    canActivate: [UrlRedirectingService],
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'page/fourofour',
    component: NotFoundComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
