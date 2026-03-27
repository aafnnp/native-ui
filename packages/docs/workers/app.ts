/**
 * Cloudflare Worker 入口：基于 Wrangler ASSETS 直出 Astro 静态产物
 */
interface DocsAssetsBinding {
  fetch(request: Request): Promise<Response>;
}

interface DocsWorkerEnv {
  ASSETS?: DocsAssetsBinding;
}

export default {
  async fetch(request: Request, env: DocsWorkerEnv): Promise<Response> {
    if (!env.ASSETS) {
      return new Response("Missing ASSETS binding", { status: 500 });
    }
    return env.ASSETS.fetch(request);
  },
};
