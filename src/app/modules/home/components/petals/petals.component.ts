import { Component, OnInit } from '@angular/core';

interface Petal {
  left: number;       // percentage 0 - 100
  size: number;       // px size (14 - 26)
  duration: number;   // seconds (6 - 14)
  delay: number;      // negative seconds for pre-warmed positions
  opacity: number;    // 0.5 - 0.95
  colorVariation: number; // index 0 - 3
}

@Component({
  selector: 'app-petals',
  templateUrl: './petals.component.html',
  styleUrl: './petals.component.scss',
  standalone: false
})
export class PetalsComponent implements OnInit {
  petals: Petal[] = [];

  ngOnInit(): void {
    this.generatePetals(28);
  }

  private generatePetals(count: number): void {
    const arr: Petal[] = [];
    for (let i = 0; i < count; i++) {
      const duration = Math.random() * 6 + 7; // 7s to 13s
      // Negative delay pre-populates petals across full height immediately on reveal
      const delay = -Math.random() * duration;
      arr.push({
        left: Math.random() * 94 + 3,
        size: Math.floor(Math.random() * 12) + 14,
        duration,
        delay,
        opacity: Math.random() * 0.45 + 0.5,
        colorVariation: i % 4
      });
    }
    this.petals = arr;
  }
}
