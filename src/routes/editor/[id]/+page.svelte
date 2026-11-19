<script lang="ts">
  import { page } from '$app/state';
  import { spacesStore, updateSpace, deleteSpace } from '$lib/spacesStore';
  import { ATMOSPHERES } from '$lib/types/themes';
  import type { Space, SpaceBlock, BlockType, RoomAtmosphere, BlogPost, SpacePage } from '$lib/types/space';
  import BlockRenderer from '$lib/components/BlockRenderer.svelte';
  import BlockInspector from '$lib/components/BlockInspector.svelte';
  import ExportModal from '$lib/components/ExportModal.svelte';
  import { 
    Layout, 
    Palette, 
    Layers, 
    FileText, 
    Sliders, 
    Plus, 
    Download, 
    ArrowUpRight, 
    Trash2, 
    Eye, 
    Check, 
    ChevronLeft,
    Sparkles,
    Laptop,
    Smartphone,
    Globe,
    Share2,
    Settings,
    Edit3,
    BookOpen
  } from '@lucide/svelte';

  let spaceId = $derived(page.params.id);
  let space = $derived($spacesStore.find(s => s.id === spaceId));

  // Editor layout state
  let activeLeftTab = $state<'objects' | 'pages' | 'blog' | 'themes' | 'settings'>('objects');
  let selectedBlockId = $state<string | null>(null);
  let previewDevice = $state<'desktop' | 'mobile'>('desktop');
  let isExportOpen = $state(false);
  let isSavedNotice = $state(false);

  // Active page selection
  let selectedPageId = $state<string | null>(null);

  // Current list of blocks depending on page
  let currentBlocks = $derived.by(() => {
    if (!space) return [];
    if (selectedPageId) {
      const p = space.pages.find(item => item.id === selectedPageId);
      return p ? p.blocks : [];
    }
    return space.blocks;
  });

  // Selected block object reference
  let selectedBlock = $derived.by(() => {
    if (!selectedBlockId || !space) return null;
    return currentBlocks.find(b => b.id === selectedBlockId) || null;
  });

  let selectedIndex = $derived.by(() => {
    if (!selectedBlockId) return -1;
    return currentBlocks.findIndex(b => b.id === selectedBlockId);
  });

  // Current active theme
  let theme = $derived(space ? (ATMOSPHERES[space.settings.atmosphere] || ATMOSPHERES.airy) : ATMOSPHERES.airy);

  function triggerSaveNotice() {
    if (space) {
      updateSpace(space);
      isSavedNotice = true;
      setTimeout(() => { isSavedNotice = false; }, 2000);
    }
  }

  function handleSelectBlock(id: string) {
    selectedBlockId = id;
  }

  function handleAddBlock(type: BlockType) {
    if (!space) return;

    const newId = 'blk_' + Date.now().toString(36);
    let newBlock: SpaceBlock;

    switch (type) {
      case 'header':
        newBlock = {
          id: newId,
          type: 'header',
          visible: true,
          colSpan: 2,
          name: 'Your Name',
          headline: 'Thinker & Spatial Creator',
          bio: 'Writing essays and building quiet tools from a room with natural light.',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
          statusBadge: 'Crafting',
          location: 'Earth'
        };
        break;
      case 'socials':
        newBlock = {
          id: newId,
          type: 'socials',
          visible: true,
          colSpan: 2,
          style: 'pills',
          links: [
            { id: '1', platform: 'twitter', url: 'https://x.com', label: '@handle' },
            { id: '2', platform: 'email', url: 'mailto:hello@example.com', label: 'Email' }
          ]
        };
        break;
      case 'quote':
        newBlock = {
          id: newId,
          type: 'quote',
          visible: true,
          colSpan: 2,
          quote: 'A quiet room on the web is an antidote to the endless feed.',
          author: 'Spaces by Oria'
        };
        break;
      case 'gallery':
        newBlock = {
          id: newId,
          type: 'gallery',
          visible: true,
          colSpan: 2,
          title: 'Curated Photography',
          layout: 'grid-2',
          images: [
            { id: '1', url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop', caption: 'Desk detail' },
            { id: '2', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop', caption: 'Material sample' }
          ]
        };
        break;
      case 'project_card':
        newBlock = {
          id: newId,
          type: 'project_card',
          visible: true,
          colSpan: 1,
          title: 'Project Title',
          description: 'A thoughtful artifact exploring physical materials and sensory interfaces.',
          imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
          linkUrl: 'https://example.com',
          tags: ['Hardware', 'Craft'],
          year: '2026'
        };
        break;
      case 'links':
        newBlock = {
          id: newId,
          type: 'links',
          visible: true,
          colSpan: 2,
          title: 'Essential Portals',
          items: [
            { id: '1', title: 'Quiet Architecture Manifesto', subtitle: 'On designing without addiction', url: 'https://oria.space' },
            { id: '2', title: 'Studio Monograph', subtitle: 'Selected work & studies', url: 'https://oria.space' }
          ]
        };
        break;
      case 'music_embed':
        newBlock = {
          id: newId,
          type: 'music_embed',
          visible: true,
          colSpan: 1,
          title: 'Studio Rain Session No. 1',
          artist: 'Ambient Field Recordings',
          embedUrl: 'https://open.spotify.com',
          coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop'
        };
        break;
      case 'text':
        newBlock = {
          id: newId,
          type: 'text',
          visible: true,
          colSpan: 2,
          variant: 'standard',
          content: '### Notes from the Studio\n\nWrite your thoughts, essays, or principles here using markdown.'
        };
        break;
      case 'newsletter':
        newBlock = {
          id: newId,
          type: 'newsletter',
          visible: true,
          colSpan: 2,
          heading: 'Studio Letters',
          description: 'Receive thoughtful notes on quiet design and software architecture directly in your inbox.',
          buttonText: 'Subscribe',
          placeholderText: 'your@email.com'
        };
        break;
      case 'tech_stack':
        newBlock = {
          id: newId,
          type: 'tech_stack',
          visible: true,
          colSpan: 1,
          heading: 'Instruments & Tools',
          items: [
            { name: 'Svelte 5', category: 'Framework' },
            { name: 'Dieter Rams Principles', category: 'Design Canon' }
          ]
        };
        break;
      default:
        return;
    }

    if (selectedPageId) {
      const p = space.pages.find(item => item.id === selectedPageId);
      if (p) p.blocks = [...p.blocks, newBlock];
    } else {
      space.blocks = [...space.blocks, newBlock];
    }

    selectedBlockId = newId;
    triggerSaveNotice();
  }

  function handleDeleteBlock() {
    if (!space || !selectedBlockId) return;
    if (selectedPageId) {
      const p = space.pages.find(item => item.id === selectedPageId);
      if (p) p.blocks = p.blocks.filter(b => b.id !== selectedBlockId);
    } else {
      space.blocks = space.blocks.filter(b => b.id !== selectedBlockId);
    }
    selectedBlockId = null;
    triggerSaveNotice();
  }

  function handleMoveBlock(direction: 'up' | 'down') {
    if (!space || !selectedBlockId) return;
    const list = selectedPageId 
      ? space.pages.find(p => p.id === selectedPageId)?.blocks 
      : space.blocks;

    if (!list) return;

    const idx = list.findIndex(b => b.id === selectedBlockId);
    if (idx < 0) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const [moved] = list.splice(idx, 1);
    list.splice(targetIdx, 0, moved);

    if (selectedPageId) {
      const p = space.pages.find(item => item.id === selectedPageId);
      if (p) p.blocks = [...list];
    } else {
      space.blocks = [...list];
    }

    triggerSaveNotice();
  }

  function handleAddPage() {
    if (!space) return;
    const title = prompt('Page Title (e.g. Manifesto, Colophon, Bookshelf):');
    if (!title) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newPage: SpacePage = {
      id: 'page_' + Date.now().toString(36),
      title,
      slug: slug || 'subpage',
      isNavVisible: true,
      blocks: [
        {
          id: 'blk_' + Date.now().toString(36),
          type: 'text',
          visible: true,
          colSpan: 2,
          variant: 'standard',
          content: `### ${title}\n\nFurnish this dedicated room with essays or custom collections.`
        }
      ]
    };

    space.pages = [...space.pages, newPage];
    selectedPageId = newPage.id;
    triggerSaveNotice();
  }

  function handleAddPost() {
    if (!space) return;
    const title = prompt('Essay Title:');
    if (!title) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newPost: BlogPost = {
      id: 'post_' + Date.now().toString(36),
      slug: slug || 'new-essay',
      title,
      excerpt: 'A brief reflection from this digital room.',
      content: `### ${title}\n\nBegin your essay here. Describe what you observed, what you built, or why this matters.`,
      category: 'Essay',
      tags: ['Notes'],
      isPublished: true,
      publishedAt: new Date().toISOString().split('T')[0],
      readTimeMinutes: 3
    };

    space.posts = [newPost, ...space.posts];
    triggerSaveNotice();
  }
</script>

{#if !space}
  <div class="min-h-screen flex items-center justify-center bg-[#F5F5F7] dark:bg-[#0E0E10] text-[#1D1D1F] dark:text-[#F5F5F7] p-6">
    <div class="text-center p-8 bg-white dark:bg-[#16181E] rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-sm max-w-sm">
      <h2 class="text-lg font-bold mb-2">Space Not Found</h2>
      <p class="text-xs text-neutral-500 mb-4">The space you are trying to furnish does not exist or was deleted.</p>
      <a href="/" class="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-semibold inline-block">
        Return to Dashboard
      </a>
    </div>
  </div>
{:else}
  <div class="h-screen flex flex-col bg-[#F5F5F7] dark:bg-[#0E0E10] text-[#1D1D1F] dark:text-[#F5F5F7] overflow-hidden select-none">
    <!-- Top Bar: Editor controls -->
    <header class="h-14 border-b border-black/[0.08] dark:border-white/[0.08] bg-white/70 dark:bg-[#121316]/70 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0">
      <div class="flex items-center gap-3">
        <a href="/" class="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition" title="Back to Dashboard">
          <ChevronLeft class="w-5 h-5" />
        </a>
        <div class="flex items-center gap-2">
          <span class="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">{space.name}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-neutral-500 font-medium">
            /{space.settings.slug}
          </span>
          {#if isSavedNotice}
            <span class="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 transition">
              <Check class="w-3.5 h-3.5" /> Room Saved
            </span>
          {/if}
        </div>
      </div>

      <!-- Center: Responsive Preview Switcher -->
      <div class="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/[0.04] dark:border-white/[0.04]">
        <button
          onclick={() => previewDevice = 'desktop'}
          class="p-1.5 rounded-lg transition {previewDevice === 'desktop' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-700'}"
          title="Desktop Perspective"
        >
          <Laptop class="w-4 h-4" />
        </button>
        <button
          onclick={() => previewDevice = 'mobile'}
          class="p-1.5 rounded-lg transition {previewDevice === 'mobile' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs' : 'text-neutral-400 hover:text-neutral-700'}"
          title="Mobile Perspective"
        >
          <Smartphone class="w-4 h-4" />
        </button>
      </div>

      <!-- Right side actions: Preview & Export -->
      <div class="flex items-center gap-2">
        <a
          href="/preview/{space.id}"
          target="_blank"
          class="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center gap-1.5"
        >
          <Eye class="w-3.5 h-3.5" /> Live Room
        </a>

        <button
          onclick={() => isExportOpen = true}
          class="px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition flex items-center gap-1.5 shadow-xs"
        >
          <Download class="w-3.5 h-3.5" /> Export Space
        </button>
      </div>
    </header>

    <!-- Main 3-Part Editor Layout -->
    <div class="flex-1 flex overflow-hidden">
      <!-- LEFT SIDEBAR: Structure, Objects, Themes, Pages, Blog -->
      <aside class="w-72 border-r border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-[#121316]/80 backdrop-blur-md flex flex-col shrink-0">
        <!-- Sidebar Navigation Tabs -->
        <div class="grid grid-cols-5 p-2 border-b border-black/[0.06] dark:border-white/[0.06] gap-1">
          <button
            onclick={() => activeLeftTab = 'objects'}
            class="p-2 rounded-xl text-center flex flex-col items-center gap-1 transition {activeLeftTab === 'objects' ? 'bg-black/5 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-semibold' : 'text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}"
            title="Room Objects"
          >
            <Layers class="w-4 h-4" />
            <span class="text-[9px]">Objects</span>
          </button>

          <button
            onclick={() => activeLeftTab = 'pages'}
            class="p-2 rounded-xl text-center flex flex-col items-center gap-1 transition {activeLeftTab === 'pages' ? 'bg-black/5 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-semibold' : 'text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}"
            title="Pages & Rooms"
          >
            <Layout class="w-4 h-4" />
            <span class="text-[9px]">Pages</span>
          </button>

          <button
            onclick={() => activeLeftTab = 'blog'}
            class="p-2 rounded-xl text-center flex flex-col items-center gap-1 transition {activeLeftTab === 'blog' ? 'bg-black/5 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-semibold' : 'text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}"
            title="Blog & Essays"
          >
            <BookOpen class="w-4 h-4" />
            <span class="text-[9px]">Blog</span>
          </button>

          <button
            onclick={() => activeLeftTab = 'themes'}
            class="p-2 rounded-xl text-center flex flex-col items-center gap-1 transition {activeLeftTab === 'themes' ? 'bg-black/5 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-semibold' : 'text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}"
            title="Atmosphere & Aesthetics"
          >
            <Palette class="w-4 h-4" />
            <span class="text-[9px]">Aesthetic</span>
          </button>

          <button
            onclick={() => activeLeftTab = 'settings'}
            class="p-2 rounded-xl text-center flex flex-col items-center gap-1 transition {activeLeftTab === 'settings' ? 'bg-black/5 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-semibold' : 'text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}"
            title="Space Settings"
          >
            <Settings class="w-4 h-4" />
            <span class="text-[9px]">Settings</span>
          </button>
        </div>

        <!-- Left Tab Content Area -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <!-- 1. OBJECTS / FURNISHING PALETTE -->
          {#if activeLeftTab === 'objects'}
            <div class="space-y-4">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Add to Space</span>
                <p class="text-xs text-neutral-500 mt-0.5">Furnish your room with tactile objects</p>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs">
                <button
                  onclick={() => handleAddBlock('header')}
                  class="p-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/30 bg-black/[0.01] hover:bg-black/[0.03] text-left transition flex flex-col justify-between"
                >
                  <span class="font-semibold text-neutral-900 dark:text-neutral-100">Entrance / Bio</span>
                  <span class="text-[10px] text-neutral-400">Avatar & status</span>
                </button>

                <button
                  onclick={() => handleAddBlock('quote')}
                  class="p-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/30 bg-black/[0.01] hover:bg-black/[0.03] text-left transition flex flex-col justify-between"
                >
                  <span class="font-semibold text-neutral-900 dark:text-neutral-100">Principle Quote</span>
                  <span class="text-[10px] text-neutral-400">Quiet statement</span>
                </button>

                <button
                  onclick={() => handleAddBlock('gallery')}
                  class="p-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/30 bg-black/[0.01] hover:bg-black/[0.03] text-left transition flex flex-col justify-between"
                >
                  <span class="font-semibold text-neutral-900 dark:text-neutral-100">Photo Frame</span>
                  <span class="text-[10px] text-neutral-400">2-3 picture grid</span>
                </button>

                <button
                  onclick={() => handleAddBlock('project_card')}
                  class="p-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/30 bg-black/[0.01] hover:bg-black/[0.03] text-left transition flex flex-col justify-between"
                >
                  <span class="font-semibold text-neutral-900 dark:text-neutral-100">Project Object</span>
                  <span class="text-[10px] text-neutral-400">Craft / hardware</span>
                </button>

                <button
                  onclick={() => handleAddBlock('links')}
                  class="p-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/30 bg-black/[0.01] hover:bg-black/[0.03] text-left transition flex flex-col justify-between"
                >
                  <span class="font-semibold text-neutral-900 dark:text-neutral-100">Curated Links</span>
                  <span class="text-[10px] text-neutral-400">Bookmarks & portals</span>
                </button>

                <button
                  onclick={() => handleAddBlock('music_embed')}
                  class="p-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/30 bg-black/[0.01] hover:bg-black/[0.03] text-left transition flex flex-col justify-between"
                >
                  <span class="font-semibold text-neutral-900 dark:text-neutral-100">Ambient Audio</span>
                  <span class="text-[10px] text-neutral-400">Soundtrack player</span>
                </button>

                <button
                  onclick={() => handleAddBlock('socials')}
                  class="p-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/30 bg-black/[0.01] hover:bg-black/[0.03] text-left transition flex flex-col justify-between"
                >
                  <span class="font-semibold text-neutral-900 dark:text-neutral-100">Social Chips</span>
                  <span class="text-[10px] text-neutral-400">Contact portals</span>
                </button>

                <button
                  onclick={() => handleAddBlock('tech_stack')}
                  class="p-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/30 bg-black/[0.01] hover:bg-black/[0.03] text-left transition flex flex-col justify-between"
                >
                  <span class="font-semibold text-neutral-900 dark:text-neutral-100">Instruments</span>
                  <span class="text-[10px] text-neutral-400">Tools of craft</span>
                </button>

                <button
                  onclick={() => handleAddBlock('newsletter')}
                  class="p-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/30 bg-black/[0.01] hover:bg-black/[0.03] text-left transition flex flex-col justify-between"
                >
                  <span class="font-semibold text-neutral-900 dark:text-neutral-100">Dispatch Box</span>
                  <span class="text-[10px] text-neutral-400">Subscriber letter</span>
                </button>

                <button
                  onclick={() => handleAddBlock('text')}
                  class="p-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] hover:border-black/30 dark:hover:border-white/30 bg-black/[0.01] hover:bg-black/[0.03] text-left transition flex flex-col justify-between"
                >
                  <span class="font-semibold text-neutral-900 dark:text-neutral-100">Text / Manifesto</span>
                  <span class="text-[10px] text-neutral-400">Markdown note</span>
                </button>
              </div>

              <!-- Furnished List in this Room -->
              <div class="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Furnished Order</span>
                <div class="space-y-1.5">
                  {#each currentBlocks as blk, i}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                      onclick={() => selectedBlockId = blk.id}
                      class="px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition {selectedBlockId === blk.id ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-300'}"
                    >
                      <span class="capitalize truncate">{blk.type.replace('_', ' ')}</span>
                      <span class="text-[10px] opacity-40">#{i + 1}</span>
                    </div>
                  {/each}
                </div>
              </div>
            </div>

          <!-- 2. PAGES & CUSTOM ROOMS -->
          {:else if activeLeftTab === 'pages'}
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Room Pages</span>
                  <p class="text-xs text-neutral-500 mt-0.5">Custom subpages & essays</p>
                </div>
                <button
                  onclick={handleAddPage}
                  class="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-semibold"
                  title="Add New Room Page"
                >
                  <Plus class="w-4 h-4" />
                </button>
              </div>

              <div class="space-y-1.5">
                <button
                  type="button"
                  onclick={() => selectedPageId = null}
                  class="w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition {selectedPageId === null ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/5'}"
                >
                  <span>Main Room (index)</span>
                  <span class="text-[10px] opacity-50">{space.blocks.length} objs</span>
                </button>

                {#each space.pages as p}
                  <div class="flex items-center gap-1 group">
                    <button
                      type="button"
                      onclick={() => selectedPageId = p.id}
                      class="flex-1 text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition {selectedPageId === p.id ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold' : 'hover:bg-black/5 dark:hover:bg-white/5'}"
                    >
                      <span class="truncate">{p.title}</span>
                      <span class="text-[10px] opacity-50">/{p.slug}</span>
                    </button>
                    <button
                      onclick={() => {
                        if (confirm(`Delete page "${p.title}"?`)) {
                          space.pages = space.pages.filter(item => item.id !== p.id);
                          if (selectedPageId === p.id) selectedPageId = null;
                          triggerSaveNotice();
                        }
                      }}
                      class="p-2 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                      title="Delete Page"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                {/each}
              </div>
            </div>

          <!-- 3. BLOG & ESSAY PUBLISHING -->
          {:else if activeLeftTab === 'blog'}
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Blog & Publishing</span>
                  <p class="text-xs text-neutral-500 mt-0.5">Essays that live in your room</p>
                </div>
                <button
                  onclick={handleAddPost}
                  class="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-semibold"
                  title="Draft New Essay"
                >
                  <Plus class="w-4 h-4" />
                </button>
              </div>

              <div class="space-y-2">
                {#each space.posts as post}
                  <div class="p-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] space-y-2 bg-black/[0.01] dark:bg-white/[0.01]">
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="font-semibold text-neutral-900 dark:text-white truncate">{post.title}</span>
                      <button
                        onclick={() => {
                          if (confirm(`Delete post "${post.title}"?`)) {
                            space.posts = space.posts.filter(p => p.id !== post.id);
                            triggerSaveNotice();
                          }
                        }}
                        class="text-neutral-400 hover:text-red-500"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      bind:value={post.title}
                      onchange={triggerSaveNotice}
                      class="w-full px-2 py-1 text-xs rounded border border-black/10 dark:border-white/10 bg-transparent font-medium"
                      placeholder="Title"
                    />
                    <textarea
                      rows="2"
                      bind:value={post.excerpt}
                      onchange={triggerSaveNotice}
                      class="w-full px-2 py-1 text-[11px] rounded border border-black/10 dark:border-white/10 bg-transparent"
                      placeholder="Excerpt"
                    ></textarea>
                    <textarea
                      rows="4"
                      bind:value={post.content}
                      onchange={triggerSaveNotice}
                      class="w-full px-2 py-1 text-[11px] rounded border border-black/10 dark:border-white/10 bg-transparent font-mono"
                      placeholder="Markdown content..."
                    ></textarea>
                  </div>
                {/each}
              </div>
            </div>

          <!-- 4. THEMES & ATMOSPHERES -->
          {:else if activeLeftTab === 'themes'}
            <div class="space-y-4">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Curated Atmospheres</span>
                <p class="text-xs text-neutral-500 mt-0.5">Atmospheric room presets</p>
              </div>

              <div class="space-y-2.5">
                {#each Object.values(ATMOSPHERES) as curTheme}
                  <button
                    type="button"
                    onclick={() => {
                      if (space) {
                        space.settings.atmosphere = curTheme.id;
                        triggerSaveNotice();
                      }
                    }}
                    class="w-full p-3 rounded-2xl border text-left transition flex items-center gap-3 {space.settings.atmosphere === curTheme.id ? 'border-neutral-900 dark:border-white ring-2 ring-neutral-900 dark:ring-white bg-black/5 dark:bg-white/5' : 'border-black/[0.08] dark:border-white/[0.08] hover:border-black/20'}"
                  >
                    <div 
                      class="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-xs"
                      style="background-color: {curTheme.previewBg}; border-color: {curTheme.previewBorder}"
                    >
                      <span class="w-3 h-3 rounded-full" style="background-color: {curTheme.previewAccent}"></span>
                    </div>
                    <div>
                      <h4 class="text-xs font-semibold text-neutral-900 dark:text-neutral-100">{curTheme.name}</h4>
                      <p class="text-[10px] text-neutral-500 line-clamp-1">{curTheme.description}</p>
                    </div>
                  </button>
                {/each}
              </div>
            </div>

          <!-- 5. SPACE SETTINGS -->
          {:else if activeLeftTab === 'settings'}
            <div class="space-y-4 text-xs">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Space Architecture</span>
                <p class="text-xs text-neutral-500 mt-0.5">Domain and layout parameters</p>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="block text-[11px] font-medium text-neutral-500 mb-1">Space Name</label>
                  <input
                    type="text"
                    bind:value={space.name}
                    onchange={triggerSaveNotice}
                    class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 font-semibold"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-neutral-500 mb-1">URL Slug</label>
                  <input
                    type="text"
                    bind:value={space.settings.slug}
                    onchange={triggerSaveNotice}
                    class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-neutral-500 mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    bind:value={space.settings.coverImage}
                    onchange={triggerSaveNotice}
                    placeholder="https://..."
                    class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label class="block text-[11px] font-medium text-neutral-500 mb-1">Content Width</label>
                  <div class="grid grid-cols-3 gap-1.5 text-center">
                    {#each ['compact', 'standard', 'wide'] as w}
                      <button
                        type="button"
                        onclick={() => { if (space) { space.settings.contentWidth = w as any; triggerSaveNotice(); } }}
                        class="py-1.5 rounded-lg border capitalize text-[10px] transition {space.settings.contentWidth === w ? 'border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold' : 'border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400'}"
                      >
                        {w}
                      </button>
                    {/each}
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between">
                  <label class="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">Show Blog on Room</label>
                  <input
                    type="checkbox"
                    bind:checked={space.settings.showBlogInSpace}
                    onchange={triggerSaveNotice}
                    class="rounded accent-blue-600"
                  />
                </div>

                <div class="pt-2 flex items-center justify-between">
                  <label class="text-[11px] font-medium text-neutral-700 dark:text-neutral-300">Publish Space Publicly</label>
                  <input
                    type="checkbox"
                    bind:checked={space.settings.published}
                    onchange={triggerSaveNotice}
                    class="rounded accent-emerald-600"
                  />
                </div>

                <div class="pt-6 border-t border-red-500/10">
                  <button
                    type="button"
                    onclick={() => {
                      if (confirm(`Permanently delete "${space?.name}"?`)) {
                        deleteSpace(space.id);
                        window.location.href = '/';
                      }
                    }}
                    class="w-full py-2 px-3 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition text-xs font-semibold"
                  >
                    Delete Space
                  </button>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </aside>

      <!-- CENTER: Live Visual Interactive Preview Canvas -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-neutral-200/50 dark:bg-black/40">
        <!-- Canvas Mockup Container (Responsive Frame) -->
        <div class="transition-all duration-300 w-full {previewDevice === 'mobile' ? 'max-w-[400px] my-6 rounded-[2.5rem] border-[8px] border-neutral-900 shadow-2xl overflow-hidden' : 'max-w-4xl'}">
          <!-- Room Rendered Surface -->
          <div class="{theme.bgClass} min-h-[85vh] rounded-2xl shadow-sm p-6 sm:p-10 border {theme.borderClass}">
            <!-- Room Cover Banner if defined -->
            {#if space.settings.coverImage && !selectedPageId}
              <div class="w-full h-40 sm:h-52 rounded-xl overflow-hidden relative mb-6">
                <img src={space.settings.coverImage} alt="Cover" class="w-full h-full object-cover">
              </div>
            {/if}

            <!-- Space Navigation -->
            <nav class="flex items-center justify-between py-4 px-2 mb-6 border-b {theme.borderClass}">
              <span class="font-semibold tracking-tight text-base">{space.settings.title}</span>
              <div class="flex items-center space-x-4 text-xs opacity-75">
                <span class={!selectedPageId ? 'font-semibold underline' : ''}>Room</span>
                {#each space.pages.filter(p => p.isNavVisible) as p}
                  <span class={selectedPageId === p.id ? 'font-semibold underline' : ''}>{p.title}</span>
                {/each}
                {#if space.settings.showBlogInSpace && space.posts.length > 0}
                  <span>Blog</span>
                {/if}
              </div>
            </nav>

            <!-- Render blocks inside Room Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              {#each currentBlocks as block (block.id)}
                <BlockRenderer
                  {block}
                  {space}
                  isEditable={true}
                  isSelected={selectedBlockId === block.id}
                  onSelect={() => handleSelectBlock(block.id)}
                />
              {/each}
            </div>

            <!-- Empty room prompt if no blocks -->
            {#if currentBlocks.length === 0}
              <div class="p-12 text-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl my-8">
                <p class="text-xs text-neutral-500 mb-2">This room is empty. Furnish it using the Objects panel on the left.</p>
                <button
                  onclick={() => handleAddBlock('header')}
                  class="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-semibold"
                >
                  Add Room Entrance
                </button>
              </div>
            {/if}

            <footer class="mt-16 pt-6 border-t {theme.borderClass} text-center text-[11px] opacity-40">
              Furnished with Spaces by Oria
            </footer>
          </div>
        </div>
      </main>

      <!-- RIGHT SIDEBAR: Selected Object Inspector -->
      <BlockInspector
        bind:block={selectedBlock}
        onDelete={handleDeleteBlock}
        onMoveUp={() => handleMoveBlock('up')}
        onMoveDown={() => handleMoveBlock('down')}
        canMoveUp={selectedIndex > 0}
        canMoveDown={selectedIndex >= 0 && selectedIndex < currentBlocks.length - 1}
      />
    </div>

    <!-- Export Modal Dialog -->
    <ExportModal {space} bind:isOpen={isExportOpen} />
  </div>
{/if}
