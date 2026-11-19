<script lang="ts">
  import { spacesStore, aiKeysStore } from '$lib/spacesStore';
  import { runAIAssistant } from '$lib/aiService';
  import type { SpaceBlock, BlockType } from '$lib/types/space';
  import { 
    Trash2, 
    Sparkles, 
    Plus, 
    X, 
    ArrowUp, 
    ArrowDown,
    LayoutGrid,
    Type,
    Image,
    Link,
    Music,
    Layers
  } from '@lucide/svelte';

  let { 
    block = $bindable(), 
    onDelete = () => {},
    onMoveUp = () => {},
    onMoveDown = () => {},
    canMoveUp = false,
    canMoveDown = false
  }: { 
    block: SpaceBlock | null; 
    onDelete?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    canMoveUp?: boolean;
    canMoveDown?: boolean;
  } = $props();

  let isGenerating = $state(false);

  async function handleAIEnhance(action: 'improve_bio' | 'suggest_quote') {
    if (!block) return;
    isGenerating = true;
    try {
      const result = await runAIAssistant({
        action,
        context: block.type === 'header' ? block.bio : block.type === 'quote' ? block.quote : ''
      }, $aiKeysStore);

      if (block.type === 'header') {
        block.bio = result;
      } else if (block.type === 'quote') {
        block.quote = result;
      }
    } finally {
      isGenerating = false;
    }
  }

  function addSocialLink() {
    if (block?.type === 'socials') {
      block.links = [
        ...block.links,
        { id: Date.now().toString(), platform: 'web', url: 'https://', label: 'New Link' }
      ];
    }
  }

  function removeSocialLink(index: number) {
    if (block?.type === 'socials') {
      block.links = block.links.filter((_, i) => i !== index);
    }
  }

  function addGalleryImage() {
    if (block?.type === 'gallery') {
      block.images = [
        ...block.images,
        {
          id: Date.now().toString(),
          url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
          caption: 'Curated Object'
        }
      ];
    }
  }

  function removeGalleryImage(index: number) {
    if (block?.type === 'gallery') {
      block.images = block.images.filter((_, i) => i !== index);
    }
  }

  function addLinkItem() {
    if (block?.type === 'links') {
      block.items = [
        ...block.items,
        {
          id: Date.now().toString(),
          title: 'Essential Reading',
          subtitle: 'A thoughtful dispatch',
          url: 'https://'
        }
      ];
    }
  }

  function removeLinkItem(index: number) {
    if (block?.type === 'links') {
      block.items = block.items.filter((_, i) => i !== index);
    }
  }
</script>

<aside class="w-80 border-l border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-[#121316]/80 backdrop-blur-md flex flex-col h-full overflow-y-auto">
  {#if block}
    <!-- Header with controls -->
    <div class="p-4 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
      <div>
        <span class="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">Selected Object</span>
        <h3 class="text-sm font-semibold capitalize text-neutral-900 dark:text-neutral-100">{block.type.replace('_', ' ')}</h3>
      </div>
      <div class="flex items-center gap-1">
        <button
          onclick={onMoveUp}
          disabled={!canMoveUp}
          class="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-20 hover:bg-black/5 dark:hover:bg-white/5"
          title="Move Object Up"
        >
          <ArrowUp class="w-3.5 h-3.5" />
        </button>
        <button
          onclick={onMoveDown}
          disabled={!canMoveDown}
          class="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-20 hover:bg-black/5 dark:hover:bg-white/5"
          title="Move Object Down"
        >
          <ArrowDown class="w-3.5 h-3.5" />
        </button>
        <button
          onclick={onDelete}
          class="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition ml-1"
          title="Remove from Space"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Inspector form body -->
    <div class="p-4 space-y-5 text-xs">
      <!-- Grid placement -->
      <div>
        <label class="block text-[11px] font-medium text-neutral-500 mb-1.5">Room Width</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            onclick={() => { if (block) block.colSpan = 1; }}
            class="py-2 px-3 rounded-xl border text-center transition {block.colSpan === 1 ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black font-semibold' : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'}"
          >
            Half Width (1 Col)
          </button>
          <button
            type="button"
            onclick={() => { if (block) block.colSpan = 2; }}
            class="py-2 px-3 rounded-xl border text-center transition {block.colSpan === 2 || !block.colSpan ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black font-semibold' : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'}"
          >
            Full Width (2 Cols)
          </button>
        </div>
      </div>

      <!-- Specific controls based on block type -->
      {#if block.type === 'header'}
        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Full Name</label>
            <input
              type="text"
              bind:value={block.name}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Headline</label>
            <input
              type="text"
              bind:value={block.headline}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[11px] font-medium text-neutral-500">Bio Narrative</label>
              <button
                type="button"
                disabled={isGenerating}
                onclick={() => handleAIEnhance('improve_bio')}
                class="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Sparkles class="w-3 h-3" />
                {isGenerating ? 'Polishing...' : 'AI Polish'}
              </button>
            </div>
            <textarea
              rows="3"
              bind:value={block.bio}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Avatar Image URL</label>
            <input
              type="text"
              bind:value={block.avatarUrl}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Status Badge</label>
            <input
              type="text"
              bind:value={block.statusBadge}
              placeholder="e.g. In the Studio, Reading"
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Location</label>
            <input
              type="text"
              bind:value={block.location}
              placeholder="e.g. Copenhagen & Kyoto"
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

      {:else if block.type === 'quote'}
        <div class="space-y-3">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-[11px] font-medium text-neutral-500">Quote</label>
              <button
                type="button"
                disabled={isGenerating}
                onclick={() => handleAIEnhance('suggest_quote')}
                class="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Sparkles class="w-3 h-3" />
                Suggest Quote
              </button>
            </div>
            <textarea
              rows="3"
              bind:value={block.quote}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500 italic"
            ></textarea>
          </div>

          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Author</label>
            <input
              type="text"
              bind:value={block.author}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Source / Publication</label>
            <input
              type="text"
              bind:value={block.source}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

      {:else if block.type === 'socials'}
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-medium text-neutral-500">Links</span>
            <button
              type="button"
              onclick={addSocialLink}
              class="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus class="w-3 h-3" /> Add Link
            </button>
          </div>

          <div class="space-y-2">
            {#each block.links as link, i}
              <div class="p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] space-y-1.5 relative group">
                <button
                  type="button"
                  onclick={() => removeSocialLink(i)}
                  class="absolute top-2 right-2 text-neutral-400 hover:text-red-500"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  bind:value={link.label}
                  placeholder="Label (e.g. Twitter / X)"
                  class="w-full px-2 py-1 rounded bg-transparent border border-black/5 dark:border-white/5 text-[11px]"
                />
                <input
                  type="text"
                  bind:value={link.url}
                  placeholder="URL (https://...)"
                  class="w-full px-2 py-1 rounded bg-transparent border border-black/5 dark:border-white/5 text-[11px]"
                />
              </div>
            {/each}
          </div>
        </div>

      {:else if block.type === 'gallery'}
        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Gallery Title</label>
            <input
              type="text"
              bind:value={block.title}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Grid Columns</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                onclick={() => { if (block?.type === 'gallery') block.layout = 'grid-2'; }}
                class="py-1.5 px-3 rounded-xl border text-center transition {block.layout === 'grid-2' ? 'border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold' : 'border-neutral-200 dark:border-neutral-700'}"
              >
                2 Columns
              </button>
              <button
                type="button"
                onclick={() => { if (block?.type === 'gallery') block.layout = 'grid-3'; }}
                class="py-1.5 px-3 rounded-xl border text-center transition {block.layout === 'grid-3' ? 'border-neutral-900 bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold' : 'border-neutral-200 dark:border-neutral-700'}"
              >
                3 Columns
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <span class="text-[11px] font-medium text-neutral-500">Framed Photos</span>
            <button
              type="button"
              onclick={addGalleryImage}
              class="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus class="w-3 h-3" /> Add Photo
            </button>
          </div>

          <div class="space-y-2">
            {#each block.images as img, i}
              <div class="p-2.5 rounded-xl border border-black/10 dark:border-white/10 space-y-1.5 relative">
                <button
                  type="button"
                  onclick={() => removeGalleryImage(i)}
                  class="absolute top-2 right-2 text-neutral-400 hover:text-red-500"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  bind:value={img.url}
                  placeholder="Image URL"
                  class="w-full px-2 py-1 rounded bg-transparent border border-black/5 dark:border-white/5 text-[11px]"
                />
                <input
                  type="text"
                  bind:value={img.caption}
                  placeholder="Caption"
                  class="w-full px-2 py-1 rounded bg-transparent border border-black/5 dark:border-white/5 text-[11px]"
                />
              </div>
            {/each}
          </div>
        </div>

      {:else if block.type === 'project_card'}
        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Project Title</label>
            <input
              type="text"
              bind:value={block.title}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Description</label>
            <textarea
              rows="3"
              bind:value={block.description}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
            ></textarea>
          </div>

          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Image URL</label>
            <input
              type="text"
              bind:value={block.imageUrl}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Link URL</label>
            <input
              type="text"
              bind:value={block.linkUrl}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Year</label>
            <input
              type="text"
              bind:value={block.year}
              placeholder="e.g. 2026"
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

      {:else if block.type === 'links'}
        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Section Title</label>
            <input
              type="text"
              bind:value={block.title}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div class="flex items-center justify-between pt-1">
            <span class="text-[11px] font-medium text-neutral-500">Bookmark Items</span>
            <button
              type="button"
              onclick={addLinkItem}
              class="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus class="w-3 h-3" /> Add Link
            </button>
          </div>

          <div class="space-y-2">
            {#each block.items as item, i}
              <div class="p-2.5 rounded-xl border border-black/10 dark:border-white/10 space-y-1.5 relative">
                <button
                  type="button"
                  onclick={() => removeLinkItem(i)}
                  class="absolute top-2 right-2 text-neutral-400 hover:text-red-500"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  bind:value={item.title}
                  placeholder="Title"
                  class="w-full px-2 py-1 rounded bg-transparent border border-black/5 dark:border-white/5 text-[11px]"
                />
                <input
                  type="text"
                  bind:value={item.subtitle}
                  placeholder="Subtitle description"
                  class="w-full px-2 py-1 rounded bg-transparent border border-black/5 dark:border-white/5 text-[11px]"
                />
                <input
                  type="text"
                  bind:value={item.url}
                  placeholder="https://..."
                  class="w-full px-2 py-1 rounded bg-transparent border border-black/5 dark:border-white/5 text-[11px]"
                />
              </div>
            {/each}
          </div>
        </div>

      {:else if block.type === 'music_embed'}
        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Track / Album Title</label>
            <input
              type="text"
              bind:value={block.title}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
            />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Artist / Composer</label>
            <input
              type="text"
              bind:value={block.artist}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
            />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Cover Art URL</label>
            <input
              type="text"
              bind:value={block.coverUrl}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
            />
          </div>
          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Audio / Stream URL</label>
            <input
              type="text"
              bind:value={block.embedUrl}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>

      {:else if block.type === 'text'}
        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-medium text-neutral-500 mb-1">Markdown / Manifesto Text</label>
            <textarea
              rows="8"
              bind:value={block.content}
              class="w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-transparent text-neutral-900 dark:text-neutral-100 font-mono text-[11px] leading-relaxed"
            ></textarea>
          </div>
        </div>
      {/if}
    </div>

  {:else}
    <!-- Empty state -->
    <div class="p-8 text-center my-auto">
      <div class="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400">
        <Layers class="w-5 h-5" />
      </div>
      <h4 class="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Select an Object</h4>
      <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
        Click any furnished block in your room to customize its typography, text, images and arrangement.
      </p>
    </div>
  {/if}
</aside>
