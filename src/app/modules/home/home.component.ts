import { Component, OnDestroy, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {
  isEnvelopeHidden = signal(false);
  isHeroRevealed = signal(false);
  isMusicPlaying = signal(false);

  private bgAudio: HTMLAudioElement | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.bgAudio = new Audio('/music/bg-song.mp3');
      this.bgAudio.loop = true;
    }
  }

  ngOnDestroy(): void {
    if (this.bgAudio) {
      this.bgAudio.pause();
      this.bgAudio = null;
    }
  }

  startMusic(): void {
    if (this.bgAudio && !this.isMusicPlaying()) {
      this.bgAudio.play().then(() => {
        this.isMusicPlaying.set(true);
      }).catch(err => {
        console.warn('Audio play error:', err);
      });
    }
  }

  toggleMusic(): void {
    if (!this.bgAudio) return;

    if (this.isMusicPlaying()) {
      this.bgAudio.pause();
      this.isMusicPlaying.set(false);
    } else {
      this.bgAudio.play().then(() => {
        this.isMusicPlaying.set(true);
      }).catch(err => {
        console.warn('Audio play error:', err);
      });
    }
  }

  onEnvelopeOpened(): void {
    this.isEnvelopeHidden.set(true);
    this.isHeroRevealed.set(true);
    this.startMusic();
  }

  replayEnvelope(): void {
    this.isHeroRevealed.set(false);
    this.isEnvelopeHidden.set(false);
  }
}
