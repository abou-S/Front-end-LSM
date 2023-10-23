import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes,RouterModule} from '@angular/router'
import { HomeComponent } from './home/home.component';
import { TranslationComponent } from './translation/translation.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent },
  {path: 'translation', component: TranslationComponent },
  {path: 'about', component: AboutComponent },
  {path: 'contact', component: ContactComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
