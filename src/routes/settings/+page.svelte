<script lang="ts">
  import { aiKeysStore } from '$lib/spacesStore';
  import Navigation from '$lib/components/Navigation.svelte';
  import { Shield, Sparkles, Key, Check, Info, Lock } from '@lucide/svelte';

  let keys = $state({
    openai: $aiKeysStore.openai || '',
    anthropic: $aiKeysStore.anthropic || '',
    gemini: $aiKeysStore.gemini || ''
  });

  let hasSaved = $state(false);

  function handleSave() {
    aiKeysStore.set(keys);
    hasSaved = true;
    setTimeout(() => { hasSaved = false; }, 2500);
  }
</script>

<div class="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-[#0E0E10] text-[#1D1D1F] dark:text-[#F5F5F7]">
  <Navigation />

  <main class="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 space-y-8">
    <div>
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-3">
        <Sparkles class="w-3.5 h-3.5" />
        Bring Your Own Key (BYOK)
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">AI Intelligence & Privacy</h1>
      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
        Spaces respects your autonomy. Use your own API keys for intelligent text refinement, bio polishing, and blog drafting. Keys are saved locally in your browser storage and never uploaded to public exports or third-party servers.
      </p>
    </div>

    <!-- Security guarantee notice -->
    <div class="p-5 rounded-2xl bg-white dark:bg-[#16181E] border border-black/[0.06] dark:border-white/[0.08] flex items-start gap-3.5 shadow-xs">
      <div class="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
        <Lock class="w-5 h-5" />
      </div>
      <div class="text-xs space-y-1">
        <h4 class="font-semibold text-neutral-900 dark:text-white">Strict Zero-Leakage Export Guarantee</h4>
        <p class="text-neutral-500 dark:text-neutral-400 leading-relaxed">
          When you export your Space as a static ZIP or publish it online, all AI keys are strictly stripped. Your exported websites remain 100% static, fast, and completely safe.
        </p>
      </div>
    </div>

    <!-- API Key inputs -->
    <div class="p-8 rounded-3xl bg-white dark:bg-[#16181E] border border-black/[0.06] dark:border-white/[0.08] space-y-6 shadow-sm">
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1 flex items-center justify-between">
            <span>OpenAI API Key</span>
            <span class="text-[10px] text-neutral-400 font-normal">gpt-4o-mini support</span>
          </label>
          <div class="relative">
            <Key class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="password"
              bind:value={keys.openai}
              placeholder="sk-..."
              class="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1 flex items-center justify-between">
            <span>Google Gemini API Key</span>
            <span class="text-[10px] text-neutral-400 font-normal">Gemini 1.5 Flash support</span>
          </label>
          <div class="relative">
            <Key class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="password"
              bind:value={keys.gemini}
              placeholder="AIzaSy..."
              class="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1 flex items-center justify-between">
            <span>Anthropic API Key</span>
            <span class="text-[10px] text-neutral-400 font-normal">Claude 3.5 Sonnet support</span>
          </label>
          <div class="relative">
            <Key class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="password"
              bind:value={keys.anthropic}
              placeholder="sk-ant-..."
              class="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
        <span class="text-xs text-neutral-400">
          Keys are stored only in your browser's LocalStorage.
        </span>
        <button
          onclick={handleSave}
          class="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition flex items-center gap-1.5 shadow-sm"
        >
          {#if hasSaved}
            <Check class="w-4 h-4 text-emerald-500" /> Saved Preferences
          {:else}
            Save API Keys
          {/if}
        </button>
      </div>
    </div>
  </main>
</div>
