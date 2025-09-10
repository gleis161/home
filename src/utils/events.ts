// src/utils/events.ts
export interface ProcessedEvent {
  title: string;
  date: Date;
  endDate: Date | null;
  location: string;
  link: string;
  details: string;
  content: string;
  arrivalTime?: Date;
  trainPosition?: number;
  duration?: string;
}

export function formatDuration(startTime: Date, endTime: Date): string {
  const durationMs = endTime.getTime() - startTime.getTime();
  const minutes = Math.floor(durationMs / (60 * 1000));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return hours > 0 ? `${hours} h ${remainingMinutes} min` : `${minutes} min`;
}

export function enhanceEvents(events: ProcessedEvent[], location: string): ProcessedEvent[] {
  return events.map((event, index) => {
    const nextEvent = events[index + 1];
    
    let arrivalTime: Date;
    if (event.endDate) {
      arrivalTime = location === 'WAGENBÜHNE' 
        ? event.endDate 
        : new Date(event.endDate.getTime() - 5*60*1000);
    } else {
      const twoHoursLater = location === 'WAGENBÜHNE' 
        ? new Date(event.date.getTime() + 2*60*60*1000 - 5*60*1000) 
        : new Date(event.date.getTime() + 2*60*60*1000);
      const nextEventStart = nextEvent ? new Date(nextEvent.date.getTime() - 5*60*1000) : null;
      
      arrivalTime = nextEventStart && nextEventStart.getTime() < twoHoursLater.getTime()
        ? nextEventStart
        : twoHoursLater;
    }
    
    const duration = formatDuration(event.date, arrivalTime);
    
    // Calculate train position
    const now = new Date();
    let trainPosition: number | undefined;
    if (now.getTime() >= event.date.getTime() && now.getTime() <= arrivalTime.getTime()) {
      const totalDuration = arrivalTime.getTime() - event.date.getTime();
      const elapsed = now.getTime() - event.date.getTime();
      const progress = (elapsed / totalDuration) * 100;
      trainPosition = location === 'WAGENBÜHNE' 
        ? Math.max(2, Math.min(98, progress))
        : Math.max(5, Math.min(95, progress));
    }

    return {
      ...event,
      arrivalTime,
      trainPosition,
      duration
    };
  });
}

export const VENUE_MAPPING = {
  'WAGENBÜHNE': { key: 'wagenbuhne', name: 'WAGENBÜHNE' },
  'AHKLANG + FILM CLUB': { key: 'ahklang', name: 'AHKLANG + FILM CLUB' },
  'KPKT': { key: 'kpkt', name: 'KPKT' }
} as const;

export function groupEventsByDayAndHour(events: ProcessedEvent[]) {
  const eventsByDay = events.reduce((acc: any, event) => {
    const dayKey = event.date.toDateString();
    const hour = event.date.getHours();
    
    if (!acc[dayKey]) {
      acc[dayKey] = { date: event.date, hours: {} };
    }
    if (!acc[dayKey].hours[hour]) {
      acc[dayKey].hours[hour] = { hour, wagenbuhne: [], ahklang: [], kpkt: [] };
    }
    
    const venueKey = VENUE_MAPPING[event.location as keyof typeof VENUE_MAPPING]?.key;
    if (venueKey && acc[dayKey].hours[hour][venueKey]) {
      acc[dayKey].hours[hour][venueKey].push(event);
    }
    
    return acc;
  }, {});

  return Object.values(eventsByDay)
    .map((day: any) => ({
      ...day,
      hourlyGroups: Object.values(day.hours)
        .map((hourGroup: any) => {
          const activeVenues = Object.values(VENUE_MAPPING)
            .filter(venue => hourGroup[venue.key]?.length > 0)
            .map(venue => ({ 
              key: venue.key, 
              name: venue.name, 
              events: hourGroup[venue.key] 
            }));
          
          return {
            ...hourGroup,
            activeVenues,
            columnCount: activeVenues.length
          };
        })
        .sort((a: any, b: any) => a.hour - b.hour)
        .map((hourGroup: any, index: number, sortedHours: any[]) => {
          const prevHour = sortedHours[index - 1];
          const currentVenueKeys = hourGroup.activeVenues.map((v: any) => v.key).sort().join(',');
          const prevVenueKeys = prevHour ? prevHour.activeVenues.map((v: any) => v.key).sort().join(',') : '';
          
          return {
            ...hourGroup,
            showHeaders: currentVenueKeys !== prevVenueKeys
          };
        })
    }))
    .sort((a: any, b: any) => a.date.getTime() - b.date.getTime());
}
