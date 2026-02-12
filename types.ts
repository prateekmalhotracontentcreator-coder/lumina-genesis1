export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  BIBLE = 'BIBLE',
  PRAYERS = 'PRAYERS',
  SHEKINAH_PORTAL = 'SHEKINAH_PORTAL',
  AI_PASTOR = 'AI_PASTOR',
  COMMUNITY_HUB = 'COMMUNITY_HUB',
  MANIFEST = 'MANIFEST',
  GLORY_SCROLL = 'GLORY_SCROLL',
  PREMIUM_GUIDE = 'PREMIUM_GUIDE',
  TRIVIA = 'TRIVIA',
  CALENDAR = 'CALENDAR',
  MEDITATION = 'MEDITATION',
  OCCASIONAL_PRAYERS = 'OCCASIONAL_PRAYERS',
  MEDIA_VAULT = 'MEDIA_VAULT',
  ESTORE = 'ESTORE',
  SETTINGS = 'SETTINGS',
  BIBLE_STRUCTURE = 'BIBLE_STRUCTURE',
  SITUATION_SEARCH = 'SITUATION_SEARCH',
  CONFESSIONS = 'CONFESSIONS',
  KINGDOM_VISION = 'KINGDOM_VISION',
  SCRIBES_PROTOCOL = 'SCRIBES_PROTOCOL',
  SYSTEM_COMMAND = 'SYSTEM_COMMAND'
}

export interface UserProfile {
  uid?: string;
  name: string;
  email?: string;
  photoURL?: string;
  familyDetails: string;
  isPremium: boolean;
  points: number;
  lastLogin?: number;
  manifestationProgress?: number[];
}

export interface DevotionalContent {
  opening: string;
  pillars: { title: string; detail: string }[];
  promise: string;
  application: string[];
  prayer: string;
}

export interface BibleVerse {
  ref: string;
  text: string;
}

export interface BibleParagraph {
  verses: BibleVerse[];
  interpretation: string;
}

export interface SituationResult {
  analysis: string;
  miracleStory: string;
  narrative: string;
  videoUri?: string;
}

export interface GloryInsight {
  category: 'WORD' | 'WALK' | 'WEALTH';
  title: string;
  content: string;
  verse: string;
}

export interface KingdomStrategy {
  mandate: string;
  pillars: { title: string; action: string }[];
  propheticDeclaration: string;
  blueprintPrompt: string;
}

export interface PrayerCard {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  isAnswered: boolean;
  daysPrayed: number;
  isPrivate: boolean;
  prayCount?: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CircleMember {
  id: string;
  name: string;
  progress: number;
  lastActive: string;
  prayers: string[];
}

export interface GiftItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  type: string;
  icon: string;
}

export interface AffiliateProduct {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  affiliateUrl: string;
  category: string;
}