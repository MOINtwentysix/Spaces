export type RoomAtmosphere = 'airy' | 'warm-paper' | 'nordic' | 'obsidian' | 'atelier' | 'sage';

export interface ThemeConfig {
  id: RoomAtmosphere;
  name: string;
  description: string;
  previewBg: string;
  previewSurface: string;
  previewBorder: string;
  previewAccent: string;
  bgClass: string;
  surfaceClass: string;
  textClass: string;
  subtextClass: string;
  borderClass: string;
  accentClass: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  borderRadius: 'rounded-lg' | 'rounded-2xl' | 'rounded-3xl' | 'rounded-none';
  glassEffect: boolean;
}

export interface SocialLink {
  id: string;
  platform: 'twitter' | 'github' | 'instagram' | 'linkedin' | 'youtube' | 'substack' | 'email' | 'web';
  url: string;
  label: string;
}

export type BlockType = 
  | 'header'          // Room entrance: Avatar, name, bio, status tag
  | 'socials'         // Social links row or chips
  | 'text'            // Rich manifesto, note, or quote
  | 'gallery'         // 2-3 image curated frames
  | 'links'           // Essential bookmarks / links
  | 'music_embed'     // Sound / playlist / podcast card
  | 'video_embed'     // YouTube / Vimeo embed
  | 'quote'           // Atmospheric quote or principle
  | 'project_card'    // Featured project / portfolio object
  | 'newsletter'      // Reader subscription box
  | 'tech_stack';     // Tools & digital instruments

export interface BaseBlock {
  id: string;
  type: BlockType;
  title?: string;
  visible: boolean;
  colSpan?: 1 | 2; // Grid width: half or full width
}

export interface HeaderBlock extends BaseBlock {
  type: 'header';
  name: string;
  headline: string;
  bio: string;
  avatarUrl: string;
  statusBadge?: string;
  location?: string;
  statusDotColor?: string;
}

export interface SocialsBlock extends BaseBlock {
  type: 'socials';
  links: SocialLink[];
  style: 'minimal' | 'pills' | 'cards';
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // Markdown or rich text
  variant: 'standard' | 'callout' | 'paper';
}

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
  alt?: string;
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: GalleryItem[];
  layout: 'grid-2' | 'grid-3' | 'masonry';
}

export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon?: string;
  badge?: string;
}

export interface LinksBlock extends BaseBlock {
  type: 'links';
  items: LinkItem[];
}

export interface MusicEmbedBlock extends BaseBlock {
  type: 'music_embed';
  title: string;
  artist: string;
  embedUrl: string; // Spotify, Apple Music, or SoundCloud embed or preview
  coverUrl?: string;
}

export interface VideoEmbedBlock extends BaseBlock {
  type: 'video_embed';
  title?: string;
  videoUrl: string; // e.g. YouTube or direct MP4
  aspectRatio: '16:9' | '4:3' | '1:1';
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  quote: string;
  author: string;
  source?: string;
}

export interface ProjectCardBlock extends BaseBlock {
  type: 'project_card';
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  tags: string[];
  year?: string;
}

export interface NewsletterBlock extends BaseBlock {
  type: 'newsletter';
  heading: string;
  description: string;
  buttonText: string;
  placeholderText: string;
  provider?: 'generic' | 'buttondown' | 'substack';
}

export interface TechStackBlock extends BaseBlock {
  type: 'tech_stack';
  heading: string;
  items: { name: string; category: string; icon?: string }[];
}

export type SpaceBlock =
  | HeaderBlock
  | SocialsBlock
  | TextBlock
  | GalleryBlock
  | LinksBlock
  | MusicEmbedBlock
  | VideoEmbedBlock
  | QuoteBlock
  | ProjectCardBlock
  | NewsletterBlock
  | TechStackBlock;

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  readTimeMinutes?: number;
  seoDescription?: string;
}

export interface SpacePage {
  id: string;
  title: string;
  slug: string;
  blocks: SpaceBlock[];
  isNavVisible: boolean;
}

export interface SpaceSettings {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  atmosphere: RoomAtmosphere;
  accentColor: string; // e.g. #0071E3, #6E6E73, #D97706, #10B981, #6366F1
  fontScheme: 'sans' | 'serif' | 'mono';
  borderRadius: 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  cardStyle: 'flat' | 'floating' | 'bordered' | 'glass';
  contentWidth: 'compact' | 'standard' | 'wide';
  showBlogInSpace: boolean;
  published: boolean;
  customDomain?: string;
  coverImage?: string;
  metaKeywords?: string[];
}

export interface Space {
  id: string;
  name: string;
  settings: SpaceSettings;
  blocks: SpaceBlock[];
  pages: SpacePage[];
  posts: BlogPost[];
  createdAt: string;
  updatedAt: string;
}

export interface AIProviderKeys {
  openai?: string;
  anthropic?: string;
  gemini?: string;
}
