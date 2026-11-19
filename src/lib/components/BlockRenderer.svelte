<script lang="ts">
  import type { SpaceBlock, Space } from '$lib/types/space';
  import { ATMOSPHERES } from '$lib/types/themes';
  import { marked } from 'marked';
  import { Play, ArrowUpRight, ExternalLink, Mail } from '@lucide/svelte';

  let { 
    block, 
    space, 
    isSelected = false, 
    isEditable = false,
    onSelect = () => {} 
  }: { 
    block: SpaceBlock; 
    space: Space; 
    isSelected?: boolean; 
    isEditable?: boolean;
    onSelect?: () => void;
  } = $props();

  let theme = $derived(ATMOSPHERES[space.settings.atmosphere] || ATMOSPHERES.airy);

  let fontClass = $derived(
    theme.fontFamily === 'serif' ? 'font-serif' : theme.fontFamily === 'mono' ? 'font-mono' : 'font-sans'
  );

  let parsedMarkdown = $derived(
    block.type === 'text' ? marked.parse(block.content || '') : ''
  );
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
  onclick={onSelect}
  class="relative group transition-all duration-200 {fontClass} {block.colSpan === 2 ? 'col-span-1 md:col-span-2' : 'col-span-1'}
    {isEditable ? 'cursor-pointer' : ''}
    {isSelected ? 'ring-2 ring-blue-500 shadow-md ring-offset-2 dark:ring-offset-black' : ''}"
>
  {#if isEditable}
    <!-- Badge for editor mode -->
    <div class="absolute -top-3 right-4 opacity-0 group-hover:opacity-100 transition duration-150 z-20">
      <span class="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold bg-neutral-900 text-white shadow-sm">
        {block.type.replace('_', ' ')}
      </span>
    </div>
  {/if}

  {#if block.type === 'header'}
    <div class="p-6 md:p-8 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass} flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left transition">
      {#if block.avatarUrl}
        <img
          src={block.avatarUrl}
          alt={block.name}
          class="w-24 h-24 rounded-full object-cover shadow-sm ring-4 ring-white/60 dark:ring-black/40"
        />
      {/if}
      <div class="flex-1">
        <div class="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1.5">
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{block.name}</h1>
          {#if block.statusBadge}
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 backdrop-blur-sm text-neutral-700 dark:text-neutral-300">
              <span class="w-2 h-2 rounded-full animate-pulse" style="background-color: {block.statusDotColor || '#10B981'}"></span>
              {block.statusBadge}
            </span>
          {/if}
        </div>
        {#if block.headline}
          <p class="text-sm md:text-base font-medium opacity-85 text-neutral-800 dark:text-neutral-200 mb-2">{block.headline}</p>
        {/if}
        {#if block.bio}
          <p class="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">{block.bio}</p>
        {/if}
        {#if block.location}
          <p class="text-[11px] opacity-60 mt-3 text-neutral-500 dark:text-neutral-400 flex items-center justify-center md:justify-start gap-1">
            📍 {block.location}
          </p>
        {/if}
      </div>
    </div>

  {:else if block.type === 'socials'}
    <div class="flex flex-wrap items-center justify-center gap-2">
      {#each block.links as link}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          class="px-4 py-2 {theme.borderRadius} text-xs font-medium {theme.surfaceClass} border {theme.borderClass} hover:opacity-80 transition duration-150 shadow-xs flex items-center gap-1.5"
          onclick={(e) => { if (isEditable) e.preventDefault(); }}
        >
          <span>{link.label}</span>
          <ArrowUpRight class="w-3.5 h-3.5 opacity-50" />
        </a>
      {/each}
    </div>

  {:else if block.type === 'quote'}
    <div class="p-8 md:p-10 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass} text-center relative overflow-hidden">
      <blockquote class="text-xl md:text-2xl italic leading-snug max-w-2xl mx-auto text-neutral-800 dark:text-neutral-200">
        “{block.quote}”
      </blockquote>
      <p class="text-xs uppercase tracking-widest mt-4 text-neutral-500 dark:text-neutral-400 font-medium">
        — {block.author}{block.source ? `, ${block.source}` : ''}
      </p>
    </div>

  {:else if block.type === 'gallery'}
    <div class="p-6 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass}">
      {#if block.title}
        <h3 class="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">{block.title}</h3>
      {/if}
      <div class="grid {block.layout === 'grid-3' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'} gap-4">
        {#each block.images as img}
          <figure class="overflow-hidden rounded-xl group/img relative">
            <img
              src={img.url}
              alt={img.caption || 'Space Gallery Item'}
              class="w-full h-52 object-cover group-hover/img:scale-105 transition-transform duration-500"
            />
            {#if img.caption}
              <figcaption class="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 px-1">
                {img.caption}
              </figcaption>
            {/if}
          </figure>
        {/each}
      </div>
    </div>

  {:else if block.type === 'project_card'}
    <div class="p-6 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass} flex flex-col justify-between group/proj h-full">
      <div>
        {#if block.imageUrl}
          <div class="h-44 overflow-hidden rounded-xl mb-4 bg-neutral-100 dark:bg-neutral-800">
            <img
              src={block.imageUrl}
              alt={block.title}
              class="w-full h-full object-cover group-hover/proj:scale-105 transition duration-500"
            />
          </div>
        {/if}
        <div class="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 mb-1">
          <span>{block.year || ''}</span>
          <div class="flex gap-1">
            {#each block.tags || [] as t}
              <span class="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px] font-medium text-neutral-600 dark:text-neutral-300">{t}</span>
            {/each}
          </div>
        </div>
        <h3 class="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-1.5">{block.title}</h3>
        <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">{block.description}</p>
      </div>

      {#if block.linkUrl}
        <a
          href={block.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline gap-1 mt-2"
          onclick={(e) => { if (isEditable) e.preventDefault(); }}
        >
          Explore Artifact <ArrowUpRight class="w-3.5 h-3.5" />
        </a>
      {/if}
    </div>

  {:else if block.type === 'links'}
    <div class="p-6 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass}">
      {#if block.title}
        <h3 class="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4">{block.title}</h3>
      {/if}
      <div class="space-y-2.5">
        {#each block.items as item}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-between p-3.5 rounded-xl border {theme.borderClass} bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition group/link"
            onclick={(e) => { if (isEditable) e.preventDefault(); }}
          >
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.title}</span>
                {#if item.badge}
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">{item.badge}</span>
                {/if}
              </div>
              {#if item.subtitle}
                <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{item.subtitle}</p>
              {/if}
            </div>
            <ArrowUpRight class="w-4 h-4 text-neutral-400 group-hover/link:text-neutral-900 dark:group-hover/link:text-white transition group-hover/link:translate-x-0.5" />
          </a>
        {/each}
      </div>
    </div>

  {:else if block.type === 'music_embed'}
    <div class="p-5 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass} flex items-center gap-4">
      {#if block.coverUrl}
        <img src={block.coverUrl} alt="Album Art" class="w-16 h-16 rounded-xl object-cover shadow-sm" />
      {/if}
      <div class="flex-1 min-w-0">
        <span class="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 dark:text-neutral-500 block mb-0.5">Atmospheric Audio</span>
        <h4 class="text-sm font-semibold truncate text-neutral-900 dark:text-neutral-100">{block.title}</h4>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate">{block.artist}</p>
      </div>
      <a 
        href={block.embedUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        class="p-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black hover:scale-105 transition shadow-xs flex items-center justify-center"
        onclick={(e) => { if (isEditable) e.preventDefault(); }}
      >
        <Play class="w-4 h-4 fill-current ml-0.5" />
      </a>
    </div>

  {:else if block.type === 'tech_stack'}
    <div class="p-6 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass}">
      <h3 class="text-base font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">{block.heading || 'Instruments & Tools'}</h3>
      <div class="grid grid-cols-2 gap-2 text-xs">
        {#each block.items as i}
          <div class="p-3 rounded-xl border {theme.borderClass} bg-black/[0.02] dark:bg-white/[0.02]">
            <p class="font-medium text-neutral-900 dark:text-neutral-100">{i.name}</p>
            <p class="text-[10px] text-neutral-400 dark:text-neutral-500">{i.category}</p>
          </div>
        {/each}
      </div>
    </div>

  {:else if block.type === 'newsletter'}
    <div class="p-8 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass} text-center">
      <div class="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
        <Mail class="w-5 h-5" />
      </div>
      <h3 class="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">{block.heading}</h3>
      <p class="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-5 leading-relaxed">{block.description}</p>
      <form onsubmit={(e) => { e.preventDefault(); alert('Subscribed to dispatches.'); }} class="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
        <input
          type="email"
          placeholder={block.placeholderText || 'your@email.com'}
          class="flex-1 px-3.5 py-2 text-xs rounded-xl border {theme.borderClass} bg-black/[0.02] dark:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-neutral-900 dark:bg-white dark:text-black hover:opacity-90 transition shadow-xs"
        >
          {block.buttonText || 'Subscribe'}
        </button>
      </form>
    </div>

  {:else if block.type === 'text'}
    <div class="p-6 md:p-8 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass} prose dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
      {@html parsedMarkdown}
    </div>
  {/if}
</div>
