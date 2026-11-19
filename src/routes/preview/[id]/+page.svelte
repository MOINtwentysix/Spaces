<script lang="ts">
  import { page } from '$app/state';
  import { spacesStore } from '$lib/spacesStore';
  import BlockRenderer from '$lib/components/BlockRenderer.svelte';
  import { ATMOSPHERES } from '$lib/types/themes';
  import { ArrowLeft, ExternalLink, Globe } from '@lucide/svelte';

  let spaceId = $derived(page.params.id);
  let currentSlug = $derived(page.url.searchParams.get('p') || '');
  let isBlogView = $derived(page.url.searchParams.get('view') === 'blog');
  let selectedPostSlug = $derived(page.url.searchParams.get('post') || '');

  let space = $derived($spacesStore.find(s => s.id === spaceId));
  let theme = $derived(space ? (ATMOSPHERES[space.settings.atmosphere] || ATMOSPHERES.airy) : ATMOSPHERES.airy);

  let activeBlocks = $derived.by(() => {
    if (!space) return [];
    if (currentSlug) {
      const p = space.pages.find(item => item.slug === currentSlug);
      if (p) return p.blocks;
    }
    return space.blocks;
  });

  let activePost = $derived.by(() => {
    if (!space || !selectedPostSlug) return null;
    return space.posts.find(p => p.slug === selectedPostSlug);
  });
</script>

{#if !space}
  <div class="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 p-4">
    <div class="text-center p-8 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm">
      <h2 class="text-xl font-bold mb-2">Space Not Found</h2>
      <a href="/" class="text-sm text-blue-500 hover:underline">&larr; Return to Dashboard</a>
    </div>
  </div>
{:else}
  <div class="{theme.bgClass} min-h-screen transition-colors duration-200">
    <!-- Top subtle preview bar -->
    <div class="w-full bg-black/5 dark:bg-white/5 border-b border-black/[0.04] dark:border-white/[0.04] py-2 px-4 flex items-center justify-between text-xs text-neutral-500">
      <div class="flex items-center gap-2">
        <a href="/editor/{space.id}" class="hover:underline flex items-center gap-1 font-medium text-neutral-800 dark:text-neutral-200">
          <ArrowLeft class="w-3.5 h-3.5" /> Back to Editor
        </a>
        <span>•</span>
        <span>Live Room Preview</span>
      </div>
      <span>/{space.settings.slug}</span>
    </div>

    <!-- Space Cover image if enabled -->
    {#if space.settings.coverImage && !currentSlug && !isBlogView && !activePost}
      <div class="w-full h-48 md:h-64 overflow-hidden relative">
        <img src={space.settings.coverImage} alt={space.name} class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      </div>
    {/if}

    <!-- Space Container -->
    <div class="mx-auto px-4 sm:px-6 py-8 {space.settings.contentWidth === 'compact' ? 'max-w-2xl' : space.settings.contentWidth === 'wide' ? 'max-w-5xl' : 'max-w-3xl'}">
      <!-- Navigation -->
      <nav class="flex items-center justify-between py-6 px-4 mb-8 border-b {theme.borderClass}">
        <a href="/preview/{space.id}" class="font-semibold tracking-tight text-lg hover:opacity-80 transition">{space.settings.title}</a>
        <div class="flex items-center space-x-6 text-sm">
          <a href="/preview/{space.id}" class="hover:opacity-80 transition {!currentSlug && !isBlogView ? 'font-semibold text-blue-600 dark:text-blue-400' : 'opacity-70'}">Room</a>
          {#each space.pages.filter(p => p.isNavVisible) as p}
            <a href="/preview/{space.id}?p={p.slug}" class="hover:opacity-80 transition {currentSlug === p.slug ? 'font-semibold text-blue-600 dark:text-blue-400' : 'opacity-70'}">{p.title}</a>
          {/each}
          {#if space.settings.showBlogInSpace && space.posts.length > 0}
            <a href="/preview/{space.id}?view=blog" class="hover:opacity-80 transition {isBlogView ? 'font-semibold text-blue-600 dark:text-blue-400' : 'opacity-70'}">Blog</a>
          {/if}
        </div>
      </nav>

      <!-- View: Single Post -->
      {#if activePost}
        <article class="p-6 md:p-10 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass}">
          <div class="flex items-center gap-3 text-xs opacity-50 mb-4">
            <span class="font-semibold uppercase tracking-wider">{activePost.category}</span>
            <span>•</span>
            <span>{activePost.publishedAt || 'Draft'}</span>
            <span>•</span>
            <span>{activePost.readTimeMinutes || 3} min read</span>
          </div>

          <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight">{activePost.title}</h1>

          {#if activePost.coverImage}
            <img src={activePost.coverImage} alt={activePost.title} class="w-full h-64 md:h-80 rounded-xl object-cover mb-8">
          {/if}

          <div class="prose dark:prose-invert max-w-none text-base md:text-lg leading-relaxed opacity-90 space-y-4">
            {@html activePost.content.replace(/\n/g, '<br/>')}
          </div>

          <div class="mt-12 pt-6 border-t {theme.borderClass} flex items-center justify-between">
            <a href="/preview/{space.id}?view=blog" class="text-sm font-semibold opacity-70 hover:opacity-100">&larr; Return to Blog</a>
            <a href="/preview/{space.id}" class="text-sm font-semibold hover:underline">Visit Room &rarr;</a>
          </div>
        </article>

      <!-- View: Blog Index -->
      {:else if isBlogView}
        <div class="space-y-8">
          <header class="mb-8">
            <h1 class="text-3xl font-bold tracking-tight mb-2">Writings & Thoughts</h1>
            <p class="text-sm opacity-60">Published essays and dispatches from {space.settings.title}</p>
          </header>

          <div class="space-y-4">
            {#each space.posts as post}
              <a href="/preview/{space.id}?post={post.slug}" class="block p-6 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass} hover:translate-y-[-2px] transition duration-200">
                <div class="flex items-center gap-3 text-xs opacity-50 mb-2">
                  <span class="font-semibold uppercase tracking-wider">{post.category}</span>
                  <span>•</span>
                  <span>{post.publishedAt || 'Recent'}</span>
                  <span>•</span>
                  <span>{post.readTimeMinutes || 3} min read</span>
                </div>
                <h3 class="text-xl font-bold tracking-tight mb-2">{post.title}</h3>
                <p class="text-sm opacity-75 line-clamp-2">{post.excerpt}</p>
              </a>
            {/each}
          </div>
        </div>

      <!-- View: Room Blocks -->
      {:else}
        <main class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each activeBlocks.filter(b => b.visible) as block}
              <BlockRenderer {block} {space} isEditable={false} />
            {/each}
          </div>

          <!-- Blog section if on main room -->
          {#if !currentSlug && space.settings.showBlogInSpace && space.posts.filter(p => p.isPublished).length > 0}
            <section class="mt-16 pt-10 border-t {theme.borderClass}">
              <div class="flex items-center justify-between mb-8">
                <div>
                  <h2 class="text-2xl font-semibold tracking-tight">Recent Writings</h2>
                  <p class="text-xs opacity-60 mt-1">Dispatches, essays and notes from this room</p>
                </div>
                <a href="/preview/{space.id}?view=blog" class="text-xs uppercase tracking-wider font-semibold opacity-70 hover:opacity-100 transition">View all &rarr;</a>
              </div>
              <div class="space-y-4">
                {#each space.posts.filter(p => p.isPublished).slice(0, 3) as post}
                  <a href="/preview/{space.id}?post={post.slug}" class="block p-6 {theme.borderRadius} {theme.surfaceClass} border {theme.borderClass} hover:translate-y-[-2px] transition duration-200">
                    <div class="flex items-center justify-between text-xs opacity-60 mb-2">
                      <span class="font-medium">{post.category}</span>
                      <span>{post.readTimeMinutes || 3} min read • {post.publishedAt || ''}</span>
                    </div>
                    <h3 class="text-lg font-semibold tracking-tight mb-2">{post.title}</h3>
                    <p class="text-xs opacity-75 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  </a>
                {/each}
              </div>
            </section>
          {/if}
        </main>
      {/if}

      <!-- Room Footer -->
      <footer class="mt-20 py-8 border-t {theme.borderClass} text-center text-xs opacity-50 flex items-center justify-between">
        <span>Furnished with <a href="/" class="hover:underline font-medium">Spaces by Oria</a></span>
        <span>{new Date().getFullYear()} &copy; {space.settings.title}</span>
      </footer>
    </div>
  </div>
{/if}
