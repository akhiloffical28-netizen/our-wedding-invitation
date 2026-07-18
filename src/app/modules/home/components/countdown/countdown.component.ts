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

  @ViewChild('scratchCanvas') set scratchCanvas(content: ElementRef<HTMLCanvasElement>) {
    if (content) {
      this._canvasRef = content;
      setTimeout(() => this.initCanvas(), 100);
    }
  }

  private _canvasRef!: ElementRef<HTMLCanvasElement>;

  timeLeft = signal<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  isCompleted = signal<boolean>(false);
  showDroppedBoard = signal<boolean>(false);
  isScratched = signal<boolean>(false);
  scratchPercent = signal<number>(0);

  private isDrawing = false;
  private timer: any;

  ngOnInit(): void {
    this.updateCountdown();
    this.timer = setInterval(() => this.updateCountdown(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  toggleBoardReveal(): void {
    const newState = !this.showDroppedBoard();
    this.showDroppedBoard.set(newState);
    if (newState) {
      setTimeout(() => this.initCanvas(), 100);
    }
  }

  revealScratchCard(): void {
    this.isScratched.set(true);
    this.scratchPercent.set(100);
  }

  private initCanvas(): void {
    if (!this._canvasRef) return;
    const canvas = this._canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 600;
    canvas.height = rect.height || 360;

    // Metallic gold gradient scratch layer
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#fef08a');
    grad.addColorStop(0.3, '#f59e0b');
    grad.addColorStop(0.7, '#d97706');
    grad.addColorStop(1, '#78350f');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Gold Pattern & Text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'bold 22px serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ GOLDEN SCRATCH CARD ✨', canvas.width / 2, canvas.height / 2 - 15);

    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🪙 Rub/Scratch here to reveal Date, Venue & Map! 🪙', canvas.width / 2, canvas.height / 2 + 25);
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
    if (!this.isDrawing || this.isScratched() || !this._canvasRef) return;

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
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();
  }

  private checkScratchPercent(): void {
    if (!this._canvasRef || this.isScratched()) return;

    const canvas = this._canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const totalSampledPixels = pixels.length / 16;
    const percent = Math.round((transparentPixels / totalSampledPixels) * 100);
    this.scratchPercent.set(percent);

    if (percent >= 35) {
      this.isScratched.set(true);
    }
  }

  private updateCountdown(): void {
    const target = new Date(this.targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      this.timeLeft.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      this.isCompleted.set(true);
      this.showDroppedBoard.set(true);
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
