import { Component } from '@angular/core';

interface GalleryItem {
  url: string;
  caption: string;
  category: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  standalone: false
})
export class GalleryComponent {
  galleryItems: GalleryItem[] = [
    {
      url: '/images/first-photo.jpeg',
      caption: 'First Days in College',
      category: 'Memories'
    },
    {
      url: '/images/story-1.png',
      caption: 'Akhil & Mary',
      category: 'Pre-Wedding'
    },
    {
      url: '/images/story-2.png',
      caption: 'The Engagement Rings',
      category: 'Ceremony'
    },
    {
      url: '/hero-bg.png',
      caption: 'Romantic Moments',
      category: 'Celebration'
    }
  ];

  selectedImage: GalleryItem | null = null;

  openLightbox(item: GalleryItem): void {
    this.selectedImage = item;
  }

  closeLightbox(): void {
    this.selectedImage = null;
  }
}
