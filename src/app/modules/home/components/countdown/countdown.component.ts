import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  signal
} from '@angular/core';

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
export class CountdownComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() targetDate: string = '2027-01-31T10:00:00';
  @Input() venueTitle: string = 'Wedding Ceremony & Reception';
  @Input() venueAddress: string = 'GVK Convention Centre';
  @Input() eventTime: string = '10:00 AM IST';
  @Input() eventDateFormatted: string = 'Sunday, January 31, 2027';
  @Input() locationUrl: string = 'https://maps.app.goo.gl/1dtB6QUacNcwZiVU7';

  @ViewChild('bigScratchCanvas') bigScratchCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('crackersCanvas') crackersCanvasRef!: ElementRef<HTMLCanvasElement>;

  timeLeft = signal<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  isCompleted = signal<boolean>(false);
  showCalendarMenu = signal<boolean>(false);
  isRevealed = signal<boolean>(false);

  private isDrawing = false;
  private timer: any;
  private crackerParticles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    alpha: number;
    text?: string;
  }> = [];
  private animationFrameId: number | null = null;

  ngOnInit(): void {
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 1000);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initBigScratchCanvas();
      this.initCrackersCanvas();
    }, 150);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  private initBigScratchCanvas(): void {
    const canvas = this.bigScratchCanvasRef?.nativeElement;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const width = rect.width || 340;
    const height = rect.height || 260;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Metallic Gold Foil Background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#d97706');
    grad.addColorStop(0.2, '#fef08a');
    grad.addColorStop(0.5, '#f59e0b');
    grad.addColorStop(0.8, '#fef08a');
    grad.addColorStop(1, '#b45309');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Gold Frame Border Pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (typeof (ctx as any).roundRect === 'function') {
      (ctx as any).roundRect(6, 6, width - 12, height - 12, 18);
    } else {
      ctx.rect(6, 6, width - 12, height - 12);
    }
    ctx.stroke();

    // Centered Title & Instructions Text
    ctx.fillStyle = '#451a03';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('✨ SCRATCH HERE ✨', width / 2, height / 2 - 35);

    ctx.font = '600 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('To Reveal Event Details & Venue', width / 2, height / 2 + 5);

    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText('🎆  🎆  🎆', width / 2, height / 2 + 45);
  }

  private initCrackersCanvas(): void {
    const canvas = this.crackersCanvasRef?.nativeElement;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width || 340;
    canvas.height = rect.height || 260;
  }

  startBigScratch(event: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    this.bigScratch(event);
  }

  bigScratch(event: MouseEvent | TouchEvent): void {
    if (!this.isDrawing) return;
    const canvas = this.bigScratchCanvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event.touches && event.touches[0]) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();

    this.checkBigScratchProgress(canvas);
  }

  stopBigScratch(): void {
    this.isDrawing = false;
  }

  private checkBigScratchProgress(canvas: HTMLCanvasElement): void {
    if (this.isRevealed()) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const percentScratched = (transparentCount / (pixels.length / 4)) * 100;
    if (percentScratched > 60) {
      this.revealBigScratchCard();
    }
  }

  revealBigScratchCard(): void {
    if (this.isRevealed()) return;
    this.isRevealed.set(true);

    const canvas = this.bigScratchCanvasRef?.nativeElement;
    if (canvas) {
      canvas.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.transform = 'scale(1.05)';
    }

    // GRAND FIRECRACKERS SHOW AFTER FULL REVEAL!
    this.popCrackersBurst();
  }

  popCrackersBurst(): void {
    const canvas = this.crackersCanvasRef?.nativeElement;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    // Stage 1: Initial Center Burst
    this.spawnCrackers(width * 0.5, height * 0.4, 60);

    // Stage 2: Dual Side Bursts
    setTimeout(() => {
      this.spawnCrackers(width * 0.2, height * 0.35, 50);
      this.spawnCrackers(width * 0.8, height * 0.35, 50);
    }, 180);

    // Stage 3: Top Golden Rain Finale
    setTimeout(() => {
      this.spawnCrackers(width * 0.5, height * 0.2, 55);
    }, 380);
  }

  private spawnCrackers(cx: number, cy: number, count: number): void {
    const colors = ['#f59e0b', '#d97706', '#ef4444', '#ec4899', '#8b5cf6', '#10b981', '#fef08a', '#ffffff'];
    const emojis = ['✨', '🎆', '🎇', '🎉', '🌟', '💥'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 9;
      const useEmoji = Math.random() < 0.25;

      this.crackerParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 6,
        alpha: 1,
        text: useEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : undefined
      });
    }

    if (!this.animationFrameId) {
      this.animateCrackers();
    }
  }

  private animateCrackers(): void {
    const canvas = this.crackersCanvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = this.crackerParticles.length - 1; i >= 0; i--) {
      const p = this.crackerParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18;
      p.alpha -= 0.018;

      if (p.alpha <= 0) {
        this.crackerParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.text) {
        ctx.font = '16px serif';
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    if (this.crackerParticles.length > 0) {
      this.animationFrameId = requestAnimationFrame(() => this.animateCrackers());
    } else {
      this.animationFrameId = null;
    }
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
