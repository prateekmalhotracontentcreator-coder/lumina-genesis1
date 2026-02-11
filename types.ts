export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  BIBLE = 'BIBLE',
  PRAYERS = 'PRAYERS',
  SHEKINAH_PORTAL = 'SHEKINAH_PORTAL',
  AI_PASTOR = 'AI_PASTOR',
  COMMUNITY_HUB = 'COMMUNITY_HUB',
  MANIFEST = 'MANIFEST',
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
  CONFESSIONS = 'CONFESSIONS'
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