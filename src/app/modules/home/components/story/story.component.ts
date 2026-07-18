import { Component } from '@angular/core';

interface StoryEvent {
  date: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrl: './story.component.scss',
  standalone: false
})
export class StoryComponent {
  storyEvents: StoryEvent[] = [
    {
      date: 'September 28, 2018',
      title: 'How We Met',
      description: 'We first met in college, where she was my junior and our journey began.',
      icon: '✨',
      image: '/images/first-photo.jpeg'
    },
    {
      date: 'December 20, 2022',
      title: 'Our First Chapter',
      description: 'Shared coffee, endless laughter, and realizing we had found someone truly special.',
      icon: '☕',
      image: '/images/story-1.png'
    },
    {
      date: 'February 14, 2024',
      title: 'The Proposal',
      description: 'Under a canopy of stars, Akhil asked Mary to be his forever partner. She said YES!',
      icon: '💍',
      image: '/images/story-2.png'
    },
    {
      date: 'January 31, 2027',
      title: 'Beginning Forever',
      description: 'We step into our new life as husband and wife, surrounded by the love of family & friends.',
      icon: '💒'
    }
  ];
}
