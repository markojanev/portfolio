import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AboutComponent } from './components/pages/about/about.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { CharacterDesignComponent } from './components/pages/character-design/character-design.component';
import { ChildrenIllustrationsComponent } from './components/pages/children-illustrations/children-illustrations.component';
import { EnvironmentIllustrationsComponent } from './components/pages/environment-illustrations/environment-illustrations.component';
import { VisualDevelopmentComponent } from './components/pages/visual-development/visual-development.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { NavMainComponent } from './components/nav-main/nav-main.component';
import { MainComponent } from './components/pages/main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    GalleryComponent,
    NavbarComponent,
    AboutComponent,
    ContactComponent,
    CharacterDesignComponent,
    ChildrenIllustrationsComponent,
    EnvironmentIllustrationsComponent,
    VisualDevelopmentComponent,
    NavMainComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularResizedEventModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
