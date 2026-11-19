<script lang="ts">
  import { spacesStore, darkModeStore } from '$lib/spacesStore';
  import { Sparkles, Moon, Sun, ArrowUpRight, Compass, ShieldCheck } from '@lucide/svelte';

  let isDark = $derived($darkModeStore);

  function toggleTheme() {
    darkModeStore.update(d => !d);
  }
</script>

<header class="sticky top-0 z-40 w-full border-b border-black/[0.06] dark:border-white/[0.08] bg-white/70 dark:bg-[#0E0E10]/70 backdrop-blur-xl transition-colors">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <!-- Brand / Logo -->
    <a href="/" class="flex items-center gap-3 group">
      <div class="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm tracking-wider shadow-sm group-hover:scale-105 transition">
        O
      </div>
      <div>
        <div class="flex items-center gap-1.5">
          <span class="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">Spaces</span>
          <span class="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-neutral-500 font-medium">by Oria</span>
        </div>
        <p class="text-[11px] text-neutral-400 dark:text-neutral-500 hidden sm:block">Your Place at the Internet</p>
      </div>
    </a>

    <!-- Nav Links & Controls -->
    <div class="flex items-center gap-2 sm:gap-4">
      <a 
        href="/"
        class="text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition"
      >
        My Spaces
      </a>

      <a 
        href="/settings"
        class="text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center gap-1.5"
      >
        <Sparkles class="w-3.5 h-3.5 text-amber-500" />
        AI & Keys
      </a>

      <!-- Theme Switcher -->
      <button
        onclick={toggleTheme}
        class="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
        aria-label="Toggle Theme"
      >
        {#if isDark}
          <Sun class="w-4 h-4" />
        {:else}
          <Moon class="w-4 h-4" />
        {/if}
      </button>

      <!-- Account avatar indicator -->
      <div class="flex items-center gap-2 pl-2 border-l border-black/[0.08] dark:border-white/[0.08]">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
          alt="Elena Solís"
          class="w-7 h-7 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
        />
        <span class="text-xs font-medium hidden md:inline text-neutral-700 dark:text-neutral-300">Elena</span>
      </div>
    </div>
  </div>
</header>
