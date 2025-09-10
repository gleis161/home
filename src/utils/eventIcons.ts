// src/utils/eventIcons.ts
import CleanIcon from '../components/iconcomps/CleanIcon.astro';
import DjIcon from '../components/iconcomps/DjIcon.astro';
import EventIcon from '../components/iconcomps/EventIcon.astro';
import FilmIcon from '../components/iconcomps/FilmIcon.astro';
import SpeakerIcon from '../components/iconcomps/SpeakerIcon.astro';
import SpeechIcon from '../components/iconcomps/SpeechIcon.astro';
import WorkshopIcon from '../components/iconcomps/WorkshopIcon.astro';

export type EventType = 'LIVE' | 'FILM' | 'WORKSHOP' | 'DJ' | 'SPEECH' | 'CLEAN' | string;

const ICON_MAP = {
  LIVE: SpeakerIcon,
  FILM: FilmIcon,
  WORKSHOP: WorkshopIcon,
  DJ: DjIcon,
  SPEECH: SpeechIcon,
  CLEAN: CleanIcon,
} as const;

export function getEventIcon(eventType: string) {
  return ICON_MAP[eventType as keyof typeof ICON_MAP] || EventIcon;
}

export function getEventBadgeClass(eventType: string): string {
  const classes = {
    LIVE: 'live',
    FILM: 'film', 
    WORKSHOP: 'workshop',
    DJ: 'dj',
    SPEECH: 'speech',
  } as const;
  
  return classes[eventType as keyof typeof classes] || 'default';
}
