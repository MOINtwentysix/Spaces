<script lang="ts">
  import { spacesStore } from '$lib/spacesStore';
  import { ATMOSPHERES } from '$lib/types/themes';
  import type { Space } from '$lib/types/space';
  import { Globe, ArrowUpRight, FileText, CheckCircle2 } from '@lucide/svelte';

  let { space }: { space: Space } = $props();

  let theme = $derived(ATMOSPHERES[space.settings.atmosphere] || ATMOSPHERES.airy);
  let publishedCount = $derived(space.posts.filter(p => p.isPublished).length);
</script>

<div class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#16181E] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
  <!-- Visual Header / Cover banner -->
  <div class="relative h-44 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
    {#if space.settings.coverImage}
      <img
        src={space.settings.coverImage}
        alt={space.name}
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    {:else}
      <div 
        class="h-full w-full flex items-center justify-center"
        style="background: linear-gradient(135deg, {theme.previewBg} 0%, {theme.previewSurface} 100%)"
      >
        <span class="text-xs uppercase tracking-widest font-semibold opacity-40">Digital Room</span>
      </div>
    {/if}
    
    <!-- Atmosphere pill overlay -->
    <div class="absolute top-3 left-3 flex items-center gap-2">
      <span class="px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md bg-black/40 text-white flex items-center gap-1.5 shadow-xs">
        <span class="w-2 h-2 rounded-full" style="background-color: {theme.previewAccent}"></span>
        {theme.name}
      </span>
    </div>

    <!-- Publishing state badge -->
    <div class="absolute top-3 right-3">
      {#if space.settings.published}
        <span class="px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md bg-emerald-500/90 text-white flex items-center gap-1">
          <CheckCircle2 class="w-3 h-3" /> Live
        </span>
      {:else}
        <span class="px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md bg-amber-500/90 text-white">
          Draft Room
        </span>
      {/if}
    </div>
  </div>

  <!-- Content Body -->
  <div class="p-5 flex-1 flex flex-col justify-between">
    <div>
      <div class="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 mb-1">
        <span>/{space.settings.slug}</span>
        <span>{space.blocks.length} Objects Furnished</span>
      </div>
      <h3 class="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 line-clamp-1">
        {space.name}
      </h3>
      <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
        {space.settings.description || space.settings.tagline}
      </p>
    </div>

    <!-- Footer meta & Actions -->
    <div class="pt-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
      <div class="flex items-center gap-3 text-xs text-neutral-400">
        {#if publishedCount > 0}
          <span class="flex items-center gap-1">
            <FileText class="w-3.5 h-3.5" /> {publishedCount} post{publishedCount > 1 ? 's' : ''}
          </span>
        {/if}
      </div>

      <div class="flex items-center gap-2">
        <a
          href="/preview/{space.id}"
          target="_blank"
          class="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          title="Open Live Room Preview"
        >
          <ArrowUpRight class="w-4 h-4" />
        </a>
        <a
          href="/editor/{space.id}"
          class="px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition shadow-xs"
        >
          Furnish Space &rarr;
        </a>
      </div>
    </div>
  </div>
</div>
