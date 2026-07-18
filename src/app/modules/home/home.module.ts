import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { EnvelopeComponent } from './components/envelope/envelope.component';
import { HeroComponent } from './components/hero/hero.component';
import { StoryComponent } from './components/story/story.component';
import { CountdownComponent } from './components/countdown/countdown.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { PetalsComponent } from './components/petals/petals.component';

@NgModule({
  declarations: [
    HomeComponent,
    EnvelopeComponent,
    HeroComponent,
    StoryComponent,
    CountdownComponent,
    GalleryComponent,
    PetalsComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
