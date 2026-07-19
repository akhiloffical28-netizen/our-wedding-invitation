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
  @Input() venueTitle: string = 'Wedding Ceremony & Reception';
  @Input() venueAddress: string = 'GVK Convention Centre';
  @Input() eventTime: string = '10:00 AM IST';
  @Input() eventDateFormatted: string = 'Sunday, January 31, 2027';
  @Input() locationUrl: string = 'https://maps.app.goo.gl/1dtB6QUacNcwZiVU7';

  timeLeft = signal<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  isCompleted = signal<boolean>(false);
  showCalendarMenu = signal<boolean>(false);

  private timer: any;

  ngOnInit(): void {
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  toggleCalendarMenu(): void {
    this.showCalendarMenu.update((v) => !v);
  }

  get googleCalendarUrl(): string {
    const startDate = new Date(this.targetDate);
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);

    const formatICSDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const startISO = formatICSDate(startDate);
    const endISO = formatICSDate(endDate);

    const title = encodeURIComponent(this.venueTitle);
    const location = encodeURIComponent(this.venueAddress);
    const details = encodeURIComponent(
      `We can't wait to celebrate our wedding with you!\nDate: ${this.eventDateFormatted}\nTime: ${this.eventTime}\nVenue: ${this.venueAddress}`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startISO}/${endISO}&details=${details}&location=${location}`;
  }

  get outlookCalendarUrl(): string {
    const startDate = new Date(this.targetDate);
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);

    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    const title = encodeURIComponent(this.venueTitle);
    const location = encodeURIComponent(this.venueAddress);
    const details = encodeURIComponent(
      `We can't wait to celebrate our wedding with you!\nDate: ${this.eventDateFormatted}\nTime: ${this.eventTime}\nVenue: ${this.venueAddress}`
    );

    return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${title}&startdt=${startISO}&enddt=${endISO}&body=${details}&location=${location}`;
  }

  downloadICS(): void {
    const startDate = new Date(this.targetDate);
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);

    const formatICSDate = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const startISO = formatICSDate(startDate);
    const endISO = formatICSDate(endDate);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Our Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${this.venueTitle}`,
      `DESCRIPTION:We can't wait to celebrate our wedding with you! Date: ${this.eventDateFormatted}, Time: ${this.eventTime}`,
      `LOCATION:${this.venueAddress}`,
      `DTSTART:${startISO}`,
      `DTEND:${endISO}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'wedding-event.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private updateCountdown(): void {
    const target = new Date(this.targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      this.timeLeft.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      this.isCompleted.set(true);
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
