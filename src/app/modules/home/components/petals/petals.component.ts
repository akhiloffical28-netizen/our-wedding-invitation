import { Component, OnInit } from '@angular/core';

interface Petal {
  left: number;       // percentage 0 - 100
  size: number;       // px size (14 - 26)
  duration: number;   // seconds (6 - 14)
  delay: number;      // seconds (0 - 7)
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
    this.generatePetals(24);
  }

  private generatePetals(count: number): void {
    const arr: Petal[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        left: Math.random() * 96 + 2,
        size: Math.floor(Math.random() * 12) + 14,
        duration: Math.random() * 6 + 7,
        delay: Math.random() * 6,
        opacity: Math.random() * 0.4 + 0.55,
        colorVariation: i % 4
      });
    }
    this.petals = arr;
  }
}
