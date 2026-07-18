import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';

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

  @ViewChild('heartCanvas') set heartCanvas(content: ElementRef<HTMLCanvasElement>) {
    if (content) {
      this._canvasRef = content;
      setTimeout(() => this.initHeartCanvas(), 100);
    }
  }

  private _canvasRef!: ElementRef<HTMLCanvasElement>;

  timeLeft = signal<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  isCompleted = signal<boolean>(false);
  isHeartScratched = signal<boolean>(false);

  private isDrawing = false;
  private timer: any;

  ngOnInit(): void {
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  revealHeartInstantly(): void {
    this.isHeartScratched.set(true);
  }

  private initHeartCanvas(): void {
    if (!this._canvasRef) return;
    const canvas = this._canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 340;
    canvas.height = rect.height || 320;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Red Heart Shape
    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.45;
    const size = Math.min(canvas.width, canvas.height) * 0.78;

    ctx.save();
    this.drawHeartPath(ctx, centerX, centerY, size);

    // Rich Crimson Red Gradient Fill
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#f87171');
    grad.addColorStop(0.3, '#ef4444');
    grad.addColorStop(0.7, '#dc2626');
    grad.addColorStop(1, '#991b1b');

    ctx.fillStyle = grad;
    ctx.fill();

    // Gold border line on red heart
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#fef08a';
    ctx.stroke();

    // Heart Label Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💖 Rub / Scratch Red Heart 💖', centerX, centerY - 10);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText('To Reveal Date & Venue', centerX, centerY + 15);

    ctx.restore();
  }

  private drawHeartPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number): void {
    const w = size;
    const h = size * 0.9;
    const x = cx;
    const y = cy - h / 2;

    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.3);
    ctx.bezierCurveTo(x, y + h * 0.1, x - w / 2, y, x - w / 2, y + h * 0.35);
    ctx.bezierCurveTo(x - w / 2, y + h * 0.65, x - w * 0.2, y + h * 0.85, x, y + h * 0.95);
    ctx.bezierCurveTo(x + w * 0.2, y + h * 0.85, x + w / 2, y + h * 0.65, x + w / 2, y + h * 0.35);
    ctx.bezierCurveTo(x + w / 2, y, x, y + h * 0.1, x, y + h * 0.3);
    ctx.closePath();
  }

  startScratch(e: MouseEvent | TouchEvent): void {
    this.isDrawing = true;
    this.scratch(e);
  }

  stopScratch(): void {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.checkScratchPercent();
    }
  }

  scratch(e: MouseEvent | TouchEvent): void {
    if (!this.isDrawing || this.isHeartScratched() || !this._canvasRef) return;

    const canvas = this._canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
  }

  private checkScratchPercent(): void {
    if (!this._canvasRef || this.isHeartScratched()) return;

    const canvas = this._canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 24) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const totalSampledPixels = pixels.length / 24;
    const percent = Math.round((transparentPixels / totalSampledPixels) * 100);

    if (percent >= 25) {
      this.isHeartScratched.set(true);
    }
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
