import type { Space } from './types/space';
import { ATMOSPHERES } from './types/themes';
import JSZip from 'jszip';

export function generateStaticHtml(space: Space, pageSlug?: string): string {
  const theme = ATMOSPHERES[space.settings.atmosphere] || ATMOSPHERES.airy;
  
  const fontLink = theme.fontFamily === 'serif'
    ? '<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&display=swap" rel="stylesheet">'
    : theme.fontFamily === 'mono'
    ? '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">'
    : '<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">';

  const fontCss = theme.fontFamily === 'serif'
    ? 'font-family: "Newsreader", Georgia, serif;'
    : theme.fontFamily === 'mono'
    ? 'font-family: "JetBrains Mono", Menlo, monospace;'
    : 'font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;';

  const widthClass = space.settings.contentWidth === 'compact'
    ? 'max-w-2xl'
    : space.settings.contentWidth === 'wide'
    ? 'max-w-5xl'
    : 'max-w-3xl';

  // Find blocks for current page or default room
  let activeBlocks = space.blocks;
  let activeTitle = space.settings.title;
  let isCustomPage = false;

  if (pageSlug) {
    const page = space.pages.find(p => p.slug === pageSlug);
    if (page) {
      activeBlocks = page.blocks;
      activeTitle = `${page.title} — ${space.settings.title}`;
      isCustomPage = true;
    }
  }

  // Render navigation links
  const navHtml = `
    <nav class="flex items-center justify-between py-6 px-4 mb-8 border-b ${theme.borderClass}">
      <a href="index.html" class="font-semibold tracking-tight text-lg hover:opacity-80 transition">${space.settings.title}</a>
      <div class="flex items-center space-x-6 text-sm">
        <a href="index.html" class="hover:opacity-80 transition">Room</a>
        ${space.pages.filter(p => p.isNavVisible).map(p => `
          <a href="${p.slug}.html" class="hover:opacity-80 transition ${pageSlug === p.slug ? 'font-semibold text-accent' : 'opacity-70'}">${p.title}</a>
        `).join('')}
        ${space.settings.showBlogInSpace && space.posts.length > 0 ? `
          <a href="blog.html" class="hover:opacity-80 transition ${pageSlug === 'blog' ? 'font-semibold text-accent' : 'opacity-70'}">Blog</a>
        ` : ''}
      </div>
    </nav>
  `;

  // Render blocks into HTML
  const blocksHtml = activeBlocks
    .filter(b => b.visible)
    .map(block => renderBlockHtml(block, theme, space))
    .join('\n');

  // Blog preview on main page if enabled
  let blogSectionHtml = '';
  if (!isCustomPage && space.settings.showBlogInSpace && space.posts.filter(p => p.isPublished).length > 0) {
    const publishedPosts = space.posts.filter(p => p.isPublished);
    blogSectionHtml = `
      <section class="mt-16 pt-10 border-t ${theme.borderClass}">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-semibold tracking-tight">Recent Writings</h2>
            <p class="text-sm opacity-60 mt-1">Dispatches, essays and notes from this room</p>
          </div>
          <a href="blog.html" class="text-xs uppercase tracking-wider font-medium opacity-70 hover:opacity-100 transition">View all &rarr;</a>
        </div>
        <div class="space-y-4">
          ${publishedPosts.slice(0, 3).map(post => `
            <a href="post-${post.slug}.html" class="block p-6 ${theme.borderRadius} ${theme.surfaceClass} border ${theme.borderClass} hover:translate-y-[-2px] transition duration-200">
              <div class="flex items-center justify-between text-xs opacity-60 mb-2">
                <span>${post.category}</span>
                <span>${post.readTimeMinutes || 3} min read • ${post.publishedAt || ''}</span>
              </div>
              <h3 class="text-lg font-semibold tracking-tight mb-2">${post.title}</h3>
              <p class="text-sm opacity-75 line-clamp-2">${post.excerpt}</p>
            </a>
          `).join('')}
        </div>
      </section>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${activeTitle}</title>
  <meta name="description" content="${space.settings.description}">
  ${fontLink}
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      ${fontCss}
    }
    .text-accent {
      color: ${space.settings.accentColor};
    }
    .bg-accent {
      background-color: ${space.settings.accentColor};
    }
  </style>
</head>
<body class="${theme.bgClass} min-h-screen antialiased selection:bg-neutral-800 selection:text-white">
  ${space.settings.coverImage && !isCustomPage ? `
    <div class="w-full h-48 md:h-64 overflow-hidden relative">
      <img src="${space.settings.coverImage}" alt="Space Cover" class="w-full h-full object-cover">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
    </div>
  ` : ''}

  <div class="mx-auto px-4 sm:px-6 py-8 ${widthClass}">
    ${navHtml}

    <main class="space-y-6">
      ${blocksHtml}
      ${blogSectionHtml}
    </main>

    <footer class="mt-20 py-8 border-t ${theme.borderClass} text-center text-xs opacity-50 flex items-center justify-between">
      <span>Furnished with <a href="https://oria.space" target="_blank" class="hover:underline font-medium">Spaces by Oria</a></span>
      <span>${new Date().getFullYear()} &copy; ${space.settings.title}</span>
    </footer>
  </div>
</body>
</html>`;
}

function renderBlockHtml(block: any, theme: any, space: Space): string {
  const cardBase = `p-6 md:p-8 ${theme.borderRadius} ${theme.surfaceClass} border ${theme.borderClass} transition duration-200`;

  switch (block.type) {
    case 'header':
      return `
        <div class="${cardBase} flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          ${block.avatarUrl ? `
            <img src="${block.avatarUrl}" alt="${block.name}" class="w-24 h-24 rounded-full object-cover shadow-sm ring-4 ring-white/50">
          ` : ''}
          <div class="flex-1">
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <h1 class="text-3xl font-bold tracking-tight">${block.name}</h1>
              ${block.statusBadge ? `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-black/5 dark:bg-white/10 backdrop-blur-sm">
                  <span class="w-2 h-2 rounded-full" style="background-color: ${block.statusDotColor || '#10B981'}"></span>
                  ${block.statusBadge}
                </span>
              ` : ''}
            </div>
            <p class="text-base font-medium opacity-80 mb-3">${block.headline || ''}</p>
            <p class="text-sm opacity-70 leading-relaxed max-w-xl">${block.bio || ''}</p>
            ${block.location ? `
              <p class="text-xs opacity-50 mt-3 flex items-center justify-center md:justify-start gap-1">
                📍 ${block.location}
              </p>
            ` : ''}
          </div>
        </div>
      `;

    case 'socials':
      return `
        <div class="flex flex-wrap items-center justify-center gap-2.5">
          ${block.links.map((link: any) => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
              class="px-4 py-2 ${theme.borderRadius} text-xs font-medium ${theme.surfaceClass} border ${theme.borderClass} hover:opacity-80 transition duration-150 shadow-xs flex items-center gap-2">
              <span>${link.label}</span>
              <span class="opacity-40">&nearr;</span>
            </a>
          `).join('')}
        </div>
      `;

    case 'quote':
      return `
        <div class="${cardBase} text-center py-10 px-8">
          <blockquote class="text-xl md:text-2xl font-serif italic leading-snug max-w-2xl mx-auto opacity-90">
            "${block.quote}"
          </blockquote>
          <p class="text-xs uppercase tracking-widest mt-4 opacity-60 font-medium">
            — ${block.author}${block.source ? `, ${block.source}` : ''}
          </p>
        </div>
      `;

    case 'gallery':
      const gridCols = block.layout === 'grid-3' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2';
      return `
        <div class="${cardBase}">
          ${block.title ? `<h3 class="text-base font-semibold tracking-tight mb-4">${block.title}</h3>` : ''}
          <div class="grid ${gridCols} gap-4">
            ${block.images.map((img: any) => `
              <figure class="overflow-hidden ${theme.borderRadius} group relative">
                <img src="${img.url}" alt="${img.caption || 'Gallery Image'}" class="w-full h-56 object-cover group-hover:scale-105 transition duration-500">
                ${img.caption ? `
                  <figcaption class="text-xs opacity-60 mt-2 px-1">${img.caption}</figcaption>
                ` : ''}
              </figure>
            `).join('')}
          </div>
        </div>
      `;

    case 'project_card':
      return `
        <div class="${cardBase} flex flex-col justify-between group">
          <div>
            ${block.imageUrl ? `
              <div class="h-48 overflow-hidden rounded-xl mb-4">
                <img src="${block.imageUrl}" alt="${block.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
              </div>
            ` : ''}
            <div class="flex items-center justify-between text-xs opacity-50 mb-1">
              <span>${block.year || ''}</span>
              <div class="flex gap-1">
                ${(block.tags || []).map((t: string) => `<span class="px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[10px]">${t}</span>`).join('')}
              </div>
            </div>
            <h3 class="text-lg font-semibold tracking-tight mb-2">${block.title}</h3>
            <p class="text-sm opacity-70 leading-relaxed mb-4">${block.description}</p>
          </div>
          ${block.linkUrl ? `
            <a href="${block.linkUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-xs font-medium text-accent hover:underline gap-1">
              Explore Project &rarr;
            </a>
          ` : ''}
        </div>
      `;

    case 'links':
      return `
        <div class="${cardBase}">
          ${block.title ? `<h3 class="text-base font-semibold tracking-tight mb-4">${block.title}</h3>` : ''}
          <div class="space-y-3">
            ${block.items.map((item: any) => `
              <a href="${item.url}" target="_blank" rel="noopener noreferrer"
                class="flex items-center justify-between p-3.5 rounded-xl border ${theme.borderClass} bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] transition group">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium">${item.title}</span>
                    ${item.badge ? `<span class="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">${item.badge}</span>` : ''}
                  </div>
                  ${item.subtitle ? `<p class="text-xs opacity-60 mt-0.5">${item.subtitle}</p>` : ''}
                </div>
                <span class="text-sm opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition">&rarr;</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;

    case 'music_embed':
      return `
        <div class="${cardBase} flex items-center gap-4">
          ${block.coverUrl ? `
            <img src="${block.coverUrl}" alt="Cover" class="w-16 h-16 rounded-xl object-cover shadow-sm">
          ` : ''}
          <div class="flex-1 min-w-0">
            <span class="text-[10px] uppercase tracking-wider font-semibold opacity-50 block mb-0.5">Atmospheric Audio</span>
            <h4 class="text-sm font-semibold truncate">${block.title}</h4>
            <p class="text-xs opacity-65 truncate">${block.artist}</p>
          </div>
          <a href="${block.embedUrl}" target="_blank" rel="noopener" class="p-2.5 rounded-full bg-black/5 dark:bg-white/10 hover:scale-105 transition">
            ▶
          </a>
        </div>
      `;

    case 'tech_stack':
      return `
        <div class="${cardBase}">
          <h3 class="text-base font-semibold tracking-tight mb-3">${block.heading || 'Instruments & Tools'}</h3>
          <div class="grid grid-cols-2 gap-2 text-xs">
            ${block.items.map((i: any) => `
              <div class="p-2.5 rounded-lg border ${theme.borderClass} bg-black/[0.02] dark:bg-white/[0.02]">
                <p class="font-medium">${i.name}</p>
                <p class="text-[10px] opacity-50">${i.category}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;

    case 'newsletter':
      return `
        <div class="${cardBase} text-center py-8">
          <h3 class="text-xl font-bold tracking-tight mb-2">${block.heading}</h3>
          <p class="text-sm opacity-70 max-w-md mx-auto mb-6 leading-relaxed">${block.description}</p>
          <form onsubmit="event.preventDefault(); alert('Subscribed to room dispatches.');" class="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input type="email" required placeholder="${block.placeholderText || 'your@email.com'}" 
              class="flex-1 px-4 py-2.5 text-sm rounded-xl border ${theme.borderClass} bg-black/[0.02] dark:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-accent">
            <button type="submit" class="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-accent hover:opacity-90 transition">
              ${block.buttonText || 'Subscribe'}
            </button>
          </form>
        </div>
      `;

    case 'text':
      return `
        <div class="${cardBase} prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed opacity-90">
          ${block.content.replace(/\n/g, '<br/>')}
        </div>
      `;

    default:
      return '';
  }
}

export function generateBlogIndexHtml(space: Space): string {
  const theme = ATMOSPHERES[space.settings.atmosphere] || ATMOSPHERES.airy;
  const widthClass = space.settings.contentWidth === 'compact' ? 'max-w-2xl' : 'max-w-3xl';
  const publishedPosts = space.posts.filter(p => p.isPublished);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog — ${space.settings.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${theme.bgClass} min-h-screen antialiased">
  <div class="mx-auto px-4 sm:px-6 py-8 ${widthClass}">
    <nav class="flex items-center justify-between py-6 px-4 mb-8 border-b ${theme.borderClass}">
      <a href="index.html" class="font-semibold tracking-tight text-lg">${space.settings.title}</a>
      <a href="index.html" class="text-sm opacity-70 hover:opacity-100">&larr; Back to Room</a>
    </nav>

    <header class="mb-12">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Writings & Thoughts</h1>
      <p class="text-sm opacity-60">Published essays and dispatches from ${space.settings.title}</p>
    </header>

    <div class="space-y-6">
      ${publishedPosts.map(p => `
        <article class="p-6 md:p-8 ${theme.borderRadius} ${theme.surfaceClass} border ${theme.borderClass} hover:translate-y-[-2px] transition duration-200">
          <div class="flex items-center gap-3 text-xs opacity-50 mb-3">
            <span class="font-semibold uppercase tracking-wider text-accent">${p.category}</span>
            <span>•</span>
            <span>${p.publishedAt || 'Recent'}</span>
            <span>•</span>
            <span>${p.readTimeMinutes || 3} min read</span>
          </div>
          <h2 class="text-xl font-bold tracking-tight mb-3">
            <a href="post-${p.slug}.html" class="hover:underline">${p.title}</a>
          </h2>
          <p class="text-sm opacity-75 leading-relaxed mb-4">${p.excerpt}</p>
          <a href="post-${p.slug}.html" class="text-xs font-semibold text-accent hover:underline">Read article &rarr;</a>
        </article>
      `).join('')}
    </div>

    <footer class="mt-20 py-8 border-t ${theme.borderClass} text-center text-xs opacity-50">
      <span>${space.settings.title} • Published with Spaces by Oria</span>
    </footer>
  </div>
</body>
</html>`;
}

export function generatePostHtml(space: Space, post: any): string {
  const theme = ATMOSPHERES[space.settings.atmosphere] || ATMOSPHERES.airy;
  const widthClass = space.settings.contentWidth === 'compact' ? 'max-w-2xl' : 'max-w-3xl';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} — ${space.settings.title}</title>
  <meta name="description" content="${post.seoDescription || post.excerpt}">
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${theme.bgClass} min-h-screen antialiased">
  <div class="mx-auto px-4 sm:px-6 py-8 ${widthClass}">
    <nav class="flex items-center justify-between py-6 px-4 mb-8 border-b ${theme.borderClass}">
      <a href="index.html" class="font-semibold tracking-tight text-lg">${space.settings.title}</a>
      <a href="blog.html" class="text-sm opacity-70 hover:opacity-100">&larr; All Writings</a>
    </nav>

    <article class="p-6 md:p-10 ${theme.borderRadius} ${theme.surfaceClass} border ${theme.borderClass}">
      <div class="flex items-center gap-3 text-xs opacity-50 mb-4">
        <span class="font-semibold uppercase tracking-wider text-accent">${post.category}</span>
        <span>•</span>
        <span>${post.publishedAt || ''}</span>
        <span>•</span>
        <span>${post.readTimeMinutes || 3} min read</span>
      </div>

      <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight">${post.title}</h1>

      ${post.coverImage ? `
        <img src="${post.coverImage}" alt="${post.title}" class="w-full h-64 md:h-80 rounded-xl object-cover mb-8">
      ` : ''}

      <div class="prose dark:prose-invert max-w-none text-base md:text-lg leading-relaxed opacity-90 space-y-4">
        ${post.content.replace(/\n/g, '<br/>')}
      </div>

      <div class="mt-12 pt-6 border-t ${theme.borderClass} flex items-center justify-between">
        <a href="blog.html" class="text-sm font-semibold opacity-70 hover:opacity-100">&larr; Return to Writings</a>
        <a href="index.html" class="text-sm font-semibold text-accent hover:underline">Visit Room &rarr;</a>
      </div>
    </article>
  </div>
</body>
</html>`;
}

export function generate404Html(space: Space): string {
  const theme = ATMOSPHERES[space.settings.atmosphere] || ATMOSPHERES.airy;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Room Not Found — ${space.settings.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${theme.bgClass} min-h-screen flex items-center justify-center text-center p-6">
  <div class="max-w-md ${theme.surfaceClass} p-8 ${theme.borderRadius} border ${theme.borderClass}">
    <h1 class="text-4xl font-bold mb-2">404</h1>
    <h2 class="text-lg font-semibold mb-3">Quiet Corner Not Found</h2>
    <p class="text-sm opacity-70 mb-6">The door you opened does not lead to any room in this Space.</p>
    <a href="index.html" class="inline-block px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-semibold hover:opacity-90 transition">
      Return to Main Room
    </a>
  </div>
</body>
</html>`;
}

export async function exportSpaceAsZip(space: Space): Promise<Blob> {
  const zip = new JSZip();

  // 1. Root index.html
  zip.file('index.html', generateStaticHtml(space));

  // 2. Custom Pages
  for (const page of space.pages) {
    zip.file(`${page.slug}.html`, generateStaticHtml(space, page.slug));
  }

  // 3. Blog pages
  if (space.posts.length > 0) {
    zip.file('blog.html', generateBlogIndexHtml(space));
    for (const post of space.posts) {
      zip.file(`post-${post.slug}.html`, generatePostHtml(space, post));
    }
  }

  // 4. 404 page
  zip.file('404.html', generate404Html(space));

  // 5. Vercel deployment configuration
  const vercelJson = {
    cleanUrls: true,
    trailingSlash: false,
    headers: [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' }
        ]
      }
    ]
  };
  zip.file('vercel.json', JSON.stringify(vercelJson, null, 2));

  // 6. README.md explaining zero-dependency static deployment
  const readmeContent = `# ${space.settings.title} — Static Website Export

Exported from **Spaces by Oria** (Your Place at the Internet).

## Zero-Dependency Architecture
This archive contains a 100% self-contained static website.
- No database connection required.
- No Node.js runtime required.
- No ongoing subscriptions or API keys needed.

## Instant Deployment Options

### Option 1: Vercel
1. Install Vercel CLI: \`npm i -g vercel\`
2. Run \`vercel\` inside this directory, or drag & drop this entire folder to the Vercel dashboard.

### Option 2: Cloudflare Pages
1. Go to Cloudflare Dashboard -> Pages -> Create a Project.
2. Direct Upload -> Upload this unzipped folder.

### Option 3: GitHub Pages
1. Push this folder to a GitHub repository named \`<your-username>.github.io\`.
2. Enable GitHub Pages in repository Settings.

Built with dignity and quiet craftsmanship by Spaces by Oria.
`;
  zip.file('README.md', readmeContent);

  return await zip.generateAsync({ type: 'blob' });
}
