<script lang="ts">
  import { spacesStore, createNewSpace } from '$lib/spacesStore';
  import Navigation from '$lib/components/Navigation.svelte';
  import SpaceCard from '$lib/components/SpaceCard.svelte';
  import { Plus, Compass, Sparkles, BookOpen, Layers, ArrowUpRight, Search } from '@lucide/svelte';

  let spaces = $derived($spacesStore);
  let searchQuery = $state('');

  let filteredSpaces = $derived(
    spaces.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.settings.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.settings.slug?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  let totalPosts = $derived(
    spaces.reduce((acc, s) => acc + s.posts.length, 0)
  );

  let totalObjects = $derived(
    spaces.reduce((acc, s) => acc + s.blocks.length, 0)
  );

  function handleCreateSpace() {
    const promptName = prompt('Enter a name for your new Space:', 'Studio ' + (spaces.length + 1));
    if (promptName && promptName.trim()) {
      const created = createNewSpace(promptName.trim());
      window.location.href = `/editor/${created.id}`;
    }
  }
</script>

<div class="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-[#0E0E10] text-[#1D1D1F] dark:text-[#F5F5F7]">
  <Navigation />

  <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-12">
    <!-- Hero / Welcome Banner (Apple inspired minimalism) -->
    <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-[#16181E] border border-black/[0.06] dark:border-white/[0.08] p-8 sm:p-12 shadow-sm">
      <div class="relative z-10 max-w-2xl space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Your Place at the Internet
        </div>
        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
          Every Space is a digital room that represents its owner.
        </h1>
        <p class="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Create, furnish, and publish quiet personal websites. Share your essays, showcase your physical or digital crafts, and export zero-dependency static archives anytime.
        </p>

        <div class="pt-2 flex flex-wrap items-center gap-3">
          <button
            onclick={handleCreateSpace}
            class="px-5 py-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-sm hover:scale-[1.02] active:scale-95"
          >
            <Plus class="w-4 h-4" /> Create New Space
          </button>
          <a
            href="/settings"
            class="px-5 py-3 rounded-2xl border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center gap-1.5"
          >
            <Sparkles class="w-4 h-4 text-amber-500" /> Bring Your Own AI Key
          </a>
        </div>
      </div>

      <!-- Atmospheric background decoration -->
      <div class="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none"></div>
    </div>

    <!-- Quick Stats Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-white dark:bg-[#16181E] border border-black/[0.06] dark:border-white/[0.08]">
        <span class="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Active Spaces</span>
        <p class="text-2xl font-bold mt-1 text-neutral-900 dark:text-white">{spaces.length}</p>
      </div>
      <div class="p-5 rounded-2xl bg-white dark:bg-[#16181E] border border-black/[0.06] dark:border-white/[0.08]">
        <span class="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Furnished Objects</span>
        <p class="text-2xl font-bold mt-1 text-neutral-900 dark:text-white">{totalObjects}</p>
      </div>
      <div class="p-5 rounded-2xl bg-white dark:bg-[#16181E] border border-black/[0.06] dark:border-white/[0.08]">
        <span class="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Published Essays</span>
        <p class="text-2xl font-bold mt-1 text-neutral-900 dark:text-white">{totalPosts}</p>
      </div>
      <div class="p-5 rounded-2xl bg-white dark:bg-[#16181E] border border-black/[0.06] dark:border-white/[0.08]">
        <span class="text-xs text-neutral-400 uppercase tracking-wider font-semibold">Export Engine</span>
        <p class="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">Zero-Lockin</p>
      </div>
    </div>

    <!-- Spaces Grid Section -->
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">My Spaces</h2>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Your personal digital rooms on the internet</p>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="relative flex-1 sm:w-64">
            <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Search rooms..."
              class="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#16181E] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            />
          </div>
          <button
            onclick={handleCreateSpace}
            class="px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition flex items-center gap-1.5 shrink-0"
          >
            <Plus class="w-3.5 h-3.5" /> New Space
          </button>
        </div>
      </div>

      {#if filteredSpaces.length === 0}
        <div class="p-12 text-center rounded-3xl bg-white dark:bg-[#16181E] border border-black/[0.06] dark:border-white/[0.08] space-y-3">
          <Layers class="w-8 h-8 mx-auto text-neutral-400" />
          <h3 class="text-base font-semibold">No Spaces Match Your Query</h3>
          <p class="text-xs text-neutral-500 max-w-sm mx-auto">Try a different search term or build a new space from scratch.</p>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each filteredSpaces as space (space.id)}
            <SpaceCard {space} />
          {/each}
        </div>
      {/if}
    </div>

    <!-- Curated Editorial Callout -->
    <div class="p-8 rounded-3xl border border-black/[0.06] dark:border-white/[0.08] bg-white/60 dark:bg-[#16181E]/60 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="space-y-1 text-center md:text-left">
        <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Design Philosophy</span>
        <h3 class="text-lg font-bold text-neutral-900 dark:text-white">Why Rooms Over Profiles?</h3>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed">
          Traditional social profiles treat your personality as an algorithmically scored stream. In Spaces by Oria, you furnish a quiet place where guests take off their coats, sit down, and listen.
        </p>
      </div>
      <a
        href="/preview/space_elena_sol"
        target="_blank"
        class="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center gap-1.5 shrink-0"
      >
        Explore Elena's Room <ArrowUpRight class="w-4 h-4" />
      </a>
    </div>
  </main>

  <footer class="mt-auto border-t border-black/[0.06] dark:border-white/[0.08] py-8 text-center text-xs text-neutral-400">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span>Spaces by Oria &copy; {new Date().getFullYear()} — Designed with Apple aesthetic rigor</span>
      <div class="flex items-center gap-4 text-neutral-500">
        <span>Static ZIP Ready</span>
        <span>•</span>
        <span>Multi-Tenant Architecture</span>
        <span>•</span>
        <span>BYOK Private AI</span>
      </div>
    </div>
  </footer>
</div>
