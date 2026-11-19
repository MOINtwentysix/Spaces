import type { Space } from './types/space';

export const INITIAL_SPACES: Space[] = [
  {
    id: 'space_elena_sol',
    name: 'Elena Solís — Studio & Mind',
    settings: {
      slug: 'elena-solis',
      title: 'Elena Solís',
      tagline: 'Architect of quiet digital interfaces and tactile hardware',
      description: 'Personal digital room of Elena Solís. Product designer, essayist, and founder of Studio Oria.',
      atmosphere: 'airy',
      accentColor: '#0071E3',
      fontScheme: 'sans',
      borderRadius: 'rounded-2xl',
      cardStyle: 'glass',
      contentWidth: 'standard',
      showBlogInSpace: true,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      metaKeywords: ['product design', 'minimalism', 'apple style', 'spaces', 'oria']
    },
    blocks: [
      {
        id: 'blk_header_1',
        type: 'header',
        visible: true,
        colSpan: 2,
        name: 'Elena Solís',
        headline: 'Designer, spatial thinker & researcher at Oria Labs',
        bio: 'Designing calmer software and sensory computing devices in Zurich. Exploring how personal software can feel like a comfortable sunlit room rather than a hyperactive casino.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        statusBadge: 'Crafting hardware prototype 04',
        location: 'Zurich & Copenhagen',
        statusDotColor: '#10B981'
      },
      {
        id: 'blk_socials_1',
        type: 'socials',
        visible: true,
        colSpan: 2,
        style: 'pills',
        links: [
          { id: 's1', platform: 'twitter', url: 'https://x.com', label: '@elenasolis' },
          { id: 's2', platform: 'github', url: 'https://github.com', label: 'github/elenasolis' },
          { id: 's3', platform: 'substack', url: 'https://substack.com', label: 'Quiet Computing' },
          { id: 's4', platform: 'email', url: 'mailto:elena@oria.space', label: 'elena@oria.space' }
        ]
      },
      {
        id: 'blk_quote_1',
        type: 'quote',
        visible: true,
        colSpan: 2,
        quote: 'The digital realm does not have to be an endless stream of noise. It can be architecture. It can be a room with natural light and room to breathe.',
        author: 'Elena Solís',
        source: 'Essays on Quiet Space (2025)'
      },
      {
        id: 'blk_gallery_1',
        type: 'gallery',
        visible: true,
        colSpan: 2,
        title: 'Studio & Physical Objects',
        layout: 'grid-3',
        images: [
          {
            id: 'g1',
            url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
            caption: 'Studio desk in morning light'
          },
          {
            id: 'g2',
            url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
            caption: 'CNC milled aluminum enclosure'
          },
          {
            id: 'g3',
            url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
            caption: 'Paper sketchbook & ink'
          }
        ]
      },
      {
        id: 'blk_project_1',
        type: 'project_card',
        visible: true,
        colSpan: 1,
        title: 'Oria Monolith OS',
        description: 'An experimental spatial OS for e-ink desk displays that synchronizes calendar, weather, and ambient notes without notifications.',
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
        linkUrl: 'https://github.com',
        tags: ['E-Ink', 'C++', 'Spatial UX'],
        year: '2025'
      },
      {
        id: 'blk_project_2',
        type: 'project_card',
        visible: true,
        colSpan: 1,
        title: 'Haptic Dial Device',
        description: 'Physical rotary dial with magnetic feedback designed to control desktop audio zones and room acoustic resonance.',
        imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=800&auto=format&fit=crop',
        linkUrl: 'https://github.com',
        tags: ['Hardware', 'Industrial Design'],
        year: '2024'
      },
      {
        id: 'blk_music_1',
        type: 'music_embed',
        visible: true,
        colSpan: 1,
        title: 'Spaces Ambient Room Mix No. 7',
        artist: 'Brian Eno, Harold Budd & Nils Frahm',
        embedUrl: 'https://open.spotify.com',
        coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop'
      },
      {
        id: 'blk_tech_1',
        type: 'tech_stack',
        visible: true,
        colSpan: 1,
        heading: 'Instruments & Tools',
        items: [
          { name: 'Svelte 5 & Kit', category: 'Frontend' },
          { name: 'Figma & Paper', category: 'Ideation' },
          { name: 'Keynote & SF Pro', category: 'Presentations' },
          { name: 'Fusion 360', category: 'CAD Modeling' }
        ]
      },
      {
        id: 'blk_links_1',
        type: 'links',
        visible: true,
        colSpan: 2,
        title: 'Curated Readings & Portals',
        items: [
          {
            id: 'l1',
            title: 'The Architecture of Solitude',
            subtitle: 'On why private personal websites matter more than ever in 2026',
            url: 'https://oria.space',
            badge: 'Essential Essay'
          },
          {
            id: 'l2',
            title: 'Design Systems for Physical Living',
            subtitle: 'Translating Dieter Rams ten principles to software design tokens',
            url: 'https://oria.space',
            badge: 'Keynote'
          },
          {
            id: 'l3',
            title: 'Oria Foundation Archive',
            subtitle: 'Open source design tokens and typographic hierarchy guides',
            url: 'https://github.com'
          }
        ]
      },
      {
        id: 'blk_newsletter_1',
        type: 'newsletter',
        visible: true,
        colSpan: 2,
        heading: 'Letters from the Digital Studio',
        description: 'Bi-weekly dispatches on calm interfaces, physical computing, and creating personal spaces on the web. No spam, ever.',
        buttonText: 'Subscribe to Studio Letters',
        placeholderText: 'your@email.com',
        provider: 'generic'
      }
    ],
    pages: [
      {
        id: 'page_manifesto',
        title: 'Manifesto',
        slug: 'manifesto',
        isNavVisible: true,
        blocks: [
          {
            id: 'm1',
            type: 'text',
            visible: true,
            colSpan: 2,
            variant: 'paper',
            content: `## A Plea for the Digital Hearth

We surrendered our personal sanctuaries on the internet to corporate aggregators fifteen years ago.

Instead of tending our own gardens, we agreed to live inside identical blue and white feeds, trading ownership for algorithmic distribution. In the process, our writing became ephemeral, our identities became flattened into engagement stats, and our digital rooms were reduced to square profile thumbnails.

### The Room Metaphor

A **Space** is not an algorithmic feed. It is a room.

- It has doors you open intentionally.
- It has objects you chose to display: your books, your music, your photographs, your working tools.
- It is quiet until someone speaks.
- It belongs to you, and when someone visits, they feel your presence and aesthetic tone.

When you furnish your Space, you are reclaiming your sovereignty on the web.`
          }
        ]
      },
      {
        id: 'page_colophon',
        title: 'Colophon',
        slug: 'colophon',
        isNavVisible: true,
        blocks: [
          {
            id: 'c1',
            type: 'text',
            visible: true,
            colSpan: 2,
            variant: 'standard',
            content: `### Colophon & Technical Details

This Space is authored and published using **Spaces by Oria**.

- **Typography**: Apple SF Pro / Plus Jakarta Sans & Newsreader
- **Palette**: Monochromatic zinc, porcelain background (#F5F5F7)
- **Hosted**: Independently exportable as zero-dependency static HTML/CSS ZIP
- **Principles**: Calm, lightweight (<50kb), zero trackers, accessible.`
          }
        ]
      }
    ],
    posts: [
      {
        id: 'post_1',
        slug: 'the-art-of-quiet-software',
        title: 'The Art of Quiet Software: Designing for Focus and Dignity',
        excerpt: 'Why the next decade of user interface design will celebrate silence, tactile feedback, and intentional constraints over endless notifications.',
        content: `### The Age of Constant Notification

Every app installed on our machines competes violently for the most finite resource we possess: undivided human attention. Red badges, urgent push notifications, and gamified streaks treat the human mind as a resource to be harvested.

### Silence as a Feature

What if software respected you?

When Dieter Rams designed the Braun RT 20 radio or T 1000 receiver, the object stood quietly on the shelf until you decided to turn the dial. It was beautifully assembled, mathematically proportioned, and utterly calm.

In Spaces, we apply this philosophy to your presence online. Your Space is your room. It does not ping you. It doesn't tell you that 14 people just viewed your link. It simply exists as a refined digital home that you can invite collaborators, friends, and readers into.

### Three Rules for Quiet Interfaces

1. **Information on demand**: Show nothing until the user requests it or until it serves an urgent, genuine purpose.
2. **Tactile feedback**: Transitions should feel like moving physical paper or opening a well-machined aluminum door.
3. **Permanent ownership**: What you build must be exportable and run without external dependencies forever.`,
        coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop',
        category: 'Philosophy',
        tags: ['Design', 'Minimalism', 'Software'],
        isPublished: true,
        publishedAt: '2026-02-14',
        readTimeMinutes: 4,
        seoDescription: 'Thoughts on quiet software design, dignity in human interfaces, and intentional constraints.'
      },
      {
        id: 'post_2',
        slug: 'reclaiming-personal-publishing',
        title: 'Reclaiming Personal Publishing: Why You Need Your Own Room',
        excerpt: 'Leaving the walled gardens of social media to build lasting, sovereign homes on the open web.',
        content: `### The Walled Garden Illusion

For over a decade, social platforms promised us connection. What they delivered was enclosure. We published our finest essays on platforms that changed their algorithms overnight, hid our followers behind paywalls, and decorated our work with unrelated advertisements.

### Static is Sovereignty

When you export your Space from Oria as a static HTML archive, it will work in 2036 just as it does today. No database outages, no discontinued subscriptions, and no platform policy changes can delete your room from the internet.

Build spaces that last. Furnish them with things you love. Invite the people who care.`,
        coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop',
        category: 'Publishing',
        tags: ['Web', 'Writing', 'Independence'],
        isPublished: true,
        publishedAt: '2026-01-20',
        readTimeMinutes: 3,
        seoDescription: 'Why static personal websites represent the ultimate sovereignty on the internet.'
      }
    ],
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-02-18T12:00:00.000Z'
  },
  {
    id: 'space_kai_takahashi',
    name: 'Kai Takahashi — Sound & Architecture',
    settings: {
      slug: 'kai-takahashi',
      title: 'Kai Takahashi',
      tagline: 'Sound designer & acoustic architecture researcher',
      description: 'Kyoto based acoustic sculptor creating soundscapes for museums and sacred spaces.',
      atmosphere: 'warm-paper',
      accentColor: '#8B5E3C',
      fontScheme: 'serif',
      borderRadius: 'rounded-xl',
      cardStyle: 'bordered',
      contentWidth: 'compact',
      showBlogInSpace: true,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop'
    },
    blocks: [
      {
        id: 'k_blk_1',
        type: 'header',
        visible: true,
        colSpan: 2,
        name: 'Kai Takahashi (高橋 凱)',
        headline: 'Acoustic architect & composer in Kyoto',
        bio: 'Composing resonance chambers, microtonal synthesizers, and environmental recordings for stone temples and contemporary pavilions.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        statusBadge: 'Recording bamboo groves in Arashiyama',
        location: 'Kyoto, Japan',
        statusDotColor: '#D97706'
      },
      {
        id: 'k_blk_2',
        type: 'socials',
        visible: true,
        colSpan: 2,
        style: 'pills',
        links: [
          { id: 'ks1', platform: 'web', url: 'https://oria.space', label: 'kaitakahashi.art' },
          { id: 'ks2', platform: 'youtube', url: 'https://youtube.com', label: 'Acoustic Studies' },
          { id: 'ks3', platform: 'email', url: 'mailto:kai@takahashi.audio', label: 'kai@takahashi.audio' }
        ]
      },
      {
        id: 'k_blk_quote',
        type: 'quote',
        visible: true,
        colSpan: 2,
        quote: 'Silence is not the absence of sound; it is the presence of attention.',
        author: 'Kai Takahashi'
      },
      {
        id: 'k_blk_project',
        type: 'project_card',
        visible: true,
        colSpan: 2,
        title: 'Stone Garden Resonators (石庭の響き)',
        description: 'Concealed cedar speakers generating harmonic drones tuned to the wind velocity across Ryōan-ji courtyard.',
        imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop',
        linkUrl: 'https://takahashi.audio',
        tags: ['Audio Sculpture', 'Kyoto', 'Cedar Wood'],
        year: '2025'
      }
    ],
    pages: [],
    posts: [],
    createdAt: '2026-02-01T14:00:00.000Z',
    updatedAt: '2026-02-15T09:30:00.000Z'
  },
  {
    id: 'space_nordic_minimal',
    name: 'Aura Studio — Architectural Monograph',
    settings: {
      slug: 'aura-studio',
      title: 'Aura Studio',
      tagline: 'Nordic residential architecture & sustainable wood craft',
      description: 'Designing climate-positive wooden dwellings across Norway and Iceland.',
      atmosphere: 'nordic',
      accentColor: '#334E68',
      fontScheme: 'sans',
      borderRadius: 'rounded-2xl',
      cardStyle: 'floating',
      contentWidth: 'wide',
      showBlogInSpace: false,
      published: true,
      coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop'
    },
    blocks: [
      {
        id: 'a_blk_1',
        type: 'header',
        visible: true,
        colSpan: 2,
        name: 'Aura Studio',
        headline: 'Architecture rooted in granite, pine, and arctic light',
        bio: 'We design homes that age gracefully under snow, salt water, and northern sun. Timber structures crafted with zero synthetic adhesives.',
        avatarUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
        statusBadge: 'Building House Lofoten No. 12',
        location: 'Oslo & Tromsø',
        statusDotColor: '#0284C7'
      }
    ],
    pages: [],
    posts: [],
    createdAt: '2026-02-10T16:00:00.000Z',
    updatedAt: '2026-02-17T18:00:00.000Z'
  }
];
