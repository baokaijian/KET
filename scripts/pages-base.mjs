export function pagesBase(env = {}) {
  const override = env.VITE_BASE_PATH;
  if (override)
    return `/${override.replace(/^\/+|\/+$/g, "")}/`.replace(/^\/\/$/, "/");
  if (!env.GITHUB_ACTIONS || !env.GITHUB_REPOSITORY) return "/";
  const repo = env.GITHUB_REPOSITORY.split("/")[1];
  return !repo || repo.endsWith(".github.io") ? "/" : `/${repo}/`;
}
