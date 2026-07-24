export type SymptomType = 
  | 'Tinnitus' 
  | 'Hearing Loss' 
  | 'Nausea' 
  | 'Headache' 
  | 'Blurred Vision' 
  | 'Light Sensitivity'
  | 'Dizziness / Vertigo'
  | 'Ear Fullness';

export type VertigoSensation = 
  | 'Room Spinning (Vertigo)' 
  | 'Lightheadedness / Floating' 
  | 'Unsteadiness / Off-Balance' 
  | 'Bouncing Vision (Oscillopsia)';

export type HeadPosition = 
  | 'Standing Up' 
  | 'Turning Head Left/Right' 
  | 'Lying Down' 
  | 'Looking Up/Down' 
  | 'Bending Over' 
  | 'Sitting Still';

export type TriggerCategory = 
  | 'Salty Meal / High Sodium' 
  | 'Caffeine / Coffee' 
  | 'Stress / Anxiety' 
  | 'Weather / Pressure Drop' 
  | 'Lack of Sleep' 
  | 'Dehydration' 
  | 'Screen Fatigue' 
  | 'Travel / Motion';

export type DurationOption = '< 5 min' | '5-15 min' | '15-60 min' | '1-12 hrs' | '> 12 hrs';

export type SeverityLevel = 1 | 2 | 3 | 4 | 5;

export interface AttackEpisode {
  id: string;
  timestamp: string; // ISO string e.g. "2023-10-24T10:30:00"
  duration: DurationOption;
  severity: SeverityLevel;
  symptoms: SymptomType[];
  sensation?: VertigoSensation;
  headPosition?: HeadPosition;
  triggers?: TriggerCategory[];
  barometricPressure?: number; // e.g. 1012 hPa
  weatherCondition?: string; // e.g. "Rainy / Pressure Falling"
  notes?: string;
  voiceNoteUrl?: string;
  createdAt: number;
}

export interface UserSettings {
  medicationReminders: boolean;
  reminderTime: string;
  medicationName: string;
  iCloudSync: boolean;
  aiInsightsEnabled: boolean;
  emergencyContactName: string;
  emergencyContactPhone: string;
  doctorName: string;
}

export type ActiveTab = 'home' | 'charts' | 'monthly' | 'settings' | 'swiftCode';

