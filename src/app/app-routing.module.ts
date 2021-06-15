import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavMainComponent } from './components/nav-main/nav-main.component';
import { AboutComponent } from './components/pages/about/about.component';
import { CharacterDesignComponent } from './components/pages/character-design/character-design.component';
import { ChildrenIllustrationsComponent } from './components/pages/children-illustrations/children-illustrations.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { EnvironmentIllustrationsComponent } from './components/pages/environment-illustrations/environment-illustrations.component';
import { MainComponent } from './components/pages/main/main.component';
import { VisualDevelopmentComponent } from './components/pages/visual-development/visual-development.component';

const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },
  { path: 'main', component: MainComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'character-design', component: CharacterDesignComponent },
  { path: 'children-illustration', component: ChildrenIllustrationsComponent },
  { path: 'environment-illustration', component: EnvironmentIllustrationsComponent },
  { path: 'visual-development', component: VisualDevelopmentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
