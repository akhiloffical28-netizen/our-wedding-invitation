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
      url: '/images/secound-photo.jpeg',
      caption: 'Sweet Memories Together',
      category: 'First Chapter'
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
