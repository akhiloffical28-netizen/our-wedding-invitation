import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false
})
export class HomeComponent {
  isEnvelopeHidden = signal(false);
  isHeroRevealed = signal(false);

  onEnvelopeOpened(): void {
    this.isEnvelopeHidden.set(true);
    this.isHeroRevealed.set(true);
  }

  replayEnvelope(): void {
    this.isHeroRevealed.set(false);
    this.isEnvelopeHidden.set(false);
  }
}
