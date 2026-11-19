<script lang="ts">
  import { exportSpaceAsZip } from '$lib/exportUtils';
  import type { Space } from '$lib/types/space';
  import { Download, Sparkles, X, Check, ExternalLink, Terminal, Cloud, HelpCircle } from '@lucide/svelte';

  let { space, isOpen = $bindable(false) }: { space: Space; isOpen: boolean } = $props();

  let isExporting = $state(false);
  let activeTab = $state<'zip' | 'vercel' | 'cloudflare'>('zip');
  let hasCopiedCmd = $state(false);

  async function handleDownloadZip() {
    isExporting = true;
    try {
      const blob = await exportSpaceAsZip(space);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${space.settings.slug}-space-static.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed', e);
      alert('Could not generate export ZIP.');
    } finally {
      isExporting = false;
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    hasCopiedCmd = true;
    setTimeout(() => { hasCopiedCmd = false; }, 2000);
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
    <!-- Modal Dialog -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="bg-white dark:bg-[#16181E] border border-black/[0.08] dark:border-white/[0.08] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Header -->
      <div class="p-6 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">Export & Sovereignty</span>
          <h2 class="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Take Your Space Anywhere</h2>
        </div>
        <button
          onclick={() => isOpen = false}
          class="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation tabs -->
      <div class="flex border-b border-black/[0.06] dark:border-white/[0.06] px-6 gap-6 text-xs font-semibold">
        <button
          type="button"
          onclick={() => activeTab = 'zip'}
          class="py-3 border-b-2 transition {activeTab === 'zip' ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-neutral-100' : 'border-transparent text-neutral-400 hover:text-neutral-700'}"
        >
          Download ZIP
        </button>
        <button
          type="button"
          onclick={() => activeTab = 'vercel'}
          class="py-3 border-b-2 transition {activeTab === 'vercel' ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-neutral-100' : 'border-transparent text-neutral-400 hover:text-neutral-700'}"
        >
          Deploy to Vercel
        </button>
        <button
          type="button"
          onclick={() => activeTab = 'cloudflare'}
          class="py-3 border-b-2 transition {activeTab === 'cloudflare' ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-neutral-100' : 'border-transparent text-neutral-400 hover:text-neutral-700'}"
        >
          Cloudflare Pages
        </button>
      </div>

      <!-- Content Body -->
      <div class="p-6 space-y-4 text-xs leading-relaxed">
        {#if activeTab === 'zip'}
          <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-black/5 dark:border-white/5 space-y-2">
            <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <span>📦</span> Complete Static Independence
            </h4>
            <p class="text-neutral-500 dark:text-neutral-400">
              The exported archive contains pure HTML, CSS, JavaScript, and configuration. It runs on any web server, GitHub Pages, Apache, or Nginx with zero dependencies.
            </p>
          </div>

          <div class="space-y-2 text-neutral-600 dark:text-neutral-400">
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span><strong>index.html</strong> — Main room with furnished objects & theme</span>
            </div>
            {#if space.pages.length > 0}
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span><strong>{space.pages.length} Subpage(s)</strong> — Custom markdown & essay rooms</span>
              </div>
            {/if}
            {#if space.posts.length > 0}
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span><strong>blog.html & {space.posts.length} Post pages</strong> — Full articles with SEO metadata</span>
              </div>
            {/if}
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span><strong>404.html & vercel.json</strong> — Custom fallback & clean routing rules</span>
            </div>
          </div>

          <button
            onclick={handleDownloadZip}
            disabled={isExporting}
            class="w-full mt-4 py-3.5 px-4 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md disabled:opacity-50"
          >
            {#if isExporting}
              <span class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
              Compressing Digital Room...
            {:else}
              <Download class="w-4 h-4" /> Download Static ZIP Archive
            {/if}
          </button>

        {:else if activeTab === 'vercel'}
          <div class="space-y-3">
            <h4 class="font-semibold text-neutral-900 dark:text-neutral-100">Zero-Config Vercel Deployment</h4>
            <p class="text-neutral-500 dark:text-neutral-400">
              Your export includes a tailored <code class="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono">vercel.json</code> file for instant custom domain and SSL support.
            </p>
            <ol class="list-decimal list-inside space-y-2 text-neutral-600 dark:text-neutral-300">
              <li>Click <strong>Download ZIP</strong> and extract the files into a folder.</li>
              <li>Open your terminal in that folder and run:</li>
            </ol>
            <div class="p-3 rounded-xl bg-neutral-900 text-neutral-200 font-mono flex items-center justify-between">
              <span>npx vercel deploy --prod</span>
              <button 
                onclick={() => copyToClipboard('npx vercel deploy --prod')}
                class="text-neutral-400 hover:text-white text-[11px]"
              >
                {hasCopiedCmd ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p class="text-neutral-400 text-[11px]">
              Or simply drag and drop the unzipped folder into your <a href="https://vercel.com/new" target="_blank" class="text-blue-500 hover:underline">Vercel Dashboard</a>.
            </p>
          </div>

        {:else if activeTab === 'cloudflare'}
          <div class="space-y-3">
            <h4 class="font-semibold text-neutral-900 dark:text-neutral-100">Deploy to Cloudflare Pages (Free & Edge Fast)</h4>
            <ol class="list-decimal list-inside space-y-2 text-neutral-600 dark:text-neutral-300">
              <li>Unzip your downloaded Space archive.</li>
              <li>Go to <a href="https://dash.cloudflare.com" target="_blank" class="text-blue-500 hover:underline">Cloudflare Dashboard</a> &rarr; <strong>Workers & Pages</strong> &rarr; <strong>Create application</strong>.</li>
              <li>Select <strong>Pages</strong> &rarr; <strong>Direct Upload</strong>.</li>
              <li>Upload your extracted folder and name your project (e.g. <code class="font-mono">{space.settings.slug}</code>).</li>
            </ol>
            <div class="p-3 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300">
              Your room is now served globally across 300+ edge locations with free custom SSL.
            </div>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="p-4 bg-neutral-50 dark:bg-neutral-900/40 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500">
        <span>No lock-in. 100% portable HTML.</span>
        <button onclick={() => isOpen = false} class="font-semibold text-neutral-800 dark:text-neutral-200 hover:underline">
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
