import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss',
  standalone: false
})
export class CountdownComponent implements OnInit, OnDestroy {
  @Input() targetDate: string = '2027-01-31T10:00:00';

  timeLeft = signal<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  private timer: any;

  ngOnInit(): void {
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  private updateCountdown(): void {
    const target = new Date(this.targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      this.timeLeft.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    this.timeLeft.set({ days, hours, minutes, seconds });
  }

  formatNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
