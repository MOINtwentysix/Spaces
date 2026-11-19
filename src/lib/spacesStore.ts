import { writable } from 'svelte/store';
import type { Space, AIProviderKeys, SpaceBlock, BlogPost } from './types/space';
import { INITIAL_SPACES } from './mockData';

const STORAGE_KEY_SPACES = 'oria_spaces_v1';
const STORAGE_KEY_KEYS = 'oria_ai_keys_v1';
const STORAGE_KEY_THEME = 'oria_ui_darkmode_v1';

function getInitialSpaces(): Space[] {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SPACES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved spaces', e);
    }
  }
  return INITIAL_SPACES;
}

function getInitialKeys(): AIProviderKeys {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_KEYS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
  }
  return {
    openai: '',
    anthropic: '',
    gemini: ''
  };
}

export const spacesStore = writable<Space[]>(getInitialSpaces());
export const aiKeysStore = writable<AIProviderKeys>(getInitialKeys());
export const darkModeStore = writable<boolean>(false);

if (typeof window !== 'undefined') {
  spacesStore.subscribe(value => {
    try {
      localStorage.setItem(STORAGE_KEY_SPACES, JSON.stringify(value));
    } catch (e) {}
  });

  aiKeysStore.subscribe(value => {
    try {
      localStorage.setItem(STORAGE_KEY_KEYS, JSON.stringify(value));
    } catch (e) {}
  });

  darkModeStore.subscribe(isDark => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  });
}

export function createNewSpace(name = 'New Digital Sanctuary'): Space {
  const newId = 'space_' + Date.now().toString(36);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const newSpace: Space = {
    id: newId,
    name,
    settings: {
      slug: slug || 'my-space',
      title: name,
      tagline: 'A personal sanctuary on the web',
      description: 'Welcome to my digital room.',
      atmosphere: 'airy',
      accentColor: '#0071E3',
      fontScheme: 'sans',
      borderRadius: 'rounded-2xl',
      cardStyle: 'glass',
      contentWidth: 'standard',
      showBlogInSpace: true,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop'
    },
    blocks: [
      {
        id: 'h_' + Date.now(),
        type: 'header',
        visible: true,
        colSpan: 2,
        name: 'Your Name',
        headline: 'Thinker, Creator & Web Resident',
        bio: 'Welcome to my personal corner of the internet. I craft ideas, collect quiet artifacts, and build thoughtful tools.',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop',
        statusBadge: 'Furnishing this space',
        location: 'Earth',
        statusDotColor: '#10B981'
      },
      {
        id: 's_' + Date.now(),
        type: 'socials',
        visible: true,
        colSpan: 2,
        style: 'pills',
        links: [
          { id: '1', platform: 'twitter', url: 'https://x.com', label: '@yourhandle' },
          { id: '2', platform: 'email', url: 'mailto:hello@example.com', label: 'Email me' }
        ]
      },
      {
        id: 'q_' + Date.now(),
        type: 'quote',
        visible: true,
        colSpan: 2,
        quote: 'A room of one’s own on the worldwide web.',
        author: 'Spaces by Oria'
      }
    ],
    pages: [],
    posts: [
      {
        id: 'p_' + Date.now(),
        slug: 'welcome-to-my-room',
        title: 'Welcome to My Digital Room',
        excerpt: 'An opening note on setting up this space and what to expect here.',
        content: `### Welcome

You have arrived at my digital room. Unlike the endless feeds of social media, this space is calm, intentional, and entirely my own.

Feel free to look around, read my notes, and explore my work.`,
        category: 'Notes',
        tags: ['Welcome', 'Beginnings'],
        isPublished: true,
        publishedAt: new Date().toISOString().split('T')[0],
        readTimeMinutes: 2
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  spacesStore.update(spaces => [newSpace, ...spaces]);
  return newSpace;
}

export function updateSpace(updatedSpace: Space) {
  updatedSpace.updatedAt = new Date().toISOString();
  spacesStore.update(spaces => 
    spaces.map(s => s.id === updatedSpace.id ? updatedSpace : s)
  );
}

export function deleteSpace(id: string) {
  spacesStore.update(spaces => spaces.filter(s => s.id !== id));
}

export function duplicateSpace(space: Space): Space {
  const copy: Space = JSON.parse(JSON.stringify(space));
  copy.id = 'space_' + Date.now().toString(36);
  copy.name = `${space.name} (Copy)`;
  copy.settings.slug = `${space.settings.slug}-copy`;
  copy.createdAt = new Date().toISOString();
  copy.updatedAt = new Date().toISOString();
  spacesStore.update(spaces => [copy, ...spaces]);
  return copy;
}
