import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-envelope',
  templateUrl: './envelope.component.html',
  styleUrl: './envelope.component.scss',
  standalone: false
})
export class EnvelopeComponent {
  private _isEnvelopeHidden = false;

  @Input()
  set isEnvelopeHidden(value: boolean) {
    this._isEnvelopeHidden = value;
    if (!value) {
      // When envelope is re-shown, reset it to sealed (closed) state
      this.isEnvelopeOpen.set(false);
    }
  }

  get isEnvelopeHidden(): boolean {
    return this._isEnvelopeHidden;
  }

  @Output() opened = new EventEmitter<void>();

  isEnvelopeOpen = signal(false);

  openEnvelope(): void {
    if (this.isEnvelopeOpen()) return;

    this.isEnvelopeOpen.set(true);

    // Notify parent after opening animation completes
    setTimeout(() => {
      this.opened.emit();
    }, 1400);
  }
}
