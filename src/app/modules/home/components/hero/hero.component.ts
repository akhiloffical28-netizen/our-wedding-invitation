import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  standalone: false
})
export class HeroComponent {
  @Input() groomName = 'Akhil';
  @Input() brideName = 'Mary';
  @Input() locationUrl = 'https://maps.app.goo.gl/1dtB6QUacNcwZiVU7';
  @Input() isRevealed = false;
}
