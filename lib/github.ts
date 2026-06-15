/**
 * Guia Jardineiro — GitHub Contents API helper (production persistence)
 *
 * In production the filesystem on Vercel is read-only, so posts are committed
 * back to the GitHub repository instead. Pushing a commit to the configured
 * branch triggers a Vercel redeploy, publishing the new/updated article.
 *
 * Octokit is imported dynamically so it is never bundled into the dev path
 * (which writes to the local filesystem instead — see app/api/posts/route.ts).
 *
 * Required env vars (see README):
 *   GITHUB_TOKEN   — PAT with `repo` (contents:write) scope
 *   GITHUB_REPO    — "owner/name", e.g. "italophcarvalho/guiajardineiro"
 *   GITHUB_BRANCH  — target branch (default "main")
 */

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

/** Read GitHub config from env, or return null if not configured (→ dev mode). */
export function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;

  const [owner, name] = repo.split("/");
  if (!owner || !name) return null;

  return {
    token,
    owner,
    repo: name,
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

/** True when production GitHub persistence should be used. */
export function isGitHubMode(): boolean {
  return getGitHubConfig() !== null;
}

async function getOctokit(token: string) {
  const { Octokit } = await import("@octokit/rest");
  return new Octokit({ auth: token });
}

/**
 * Create or update a file in the repo, committing to the configured branch.
 * Returns the commit URL on success.
 */
export async function commitFile(
  config: GitHubConfig,
  filePath: string,
  content: string,
  message: string
): Promise<{ commitUrl: string }> {
  const octokit = await getOctokit(config.token);

  // Look up the existing file's blob sha (required to update, omitted to create).
  let sha: string | undefined;
  try {
    const existing = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: filePath,
      ref: config.branch,
    });
    if (!Array.isArray(existing.data) && "sha" in existing.data) {
      sha = existing.data.sha;
    }
  } catch (err: unknown) {
    // 404 → file doesn't exist yet; any other error is real.
    if (!(err && typeof err === "object" && "status" in err && err.status === 404)) {
      throw err;
    }
  }

  const res = await octokit.repos.createOrUpdateFileContents({
    owner: config.owner,
    repo: config.repo,
    path: filePath,
    message,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch: config.branch,
    sha,
  });

  return { commitUrl: res.data.commit.html_url ?? "" };
}

/** Check whether a post file already exists on the configured branch. */
export async function fileExists(
  config: GitHubConfig,
  filePath: string
): Promise<boolean> {
  const octokit = await getOctokit(config.token);
  try {
    await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: filePath,
      ref: config.branch,
    });
    return true;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "status" in err && err.status === 404) {
      return false;
    }
    throw err;
  }
}

/** Read a post file's raw text from the configured branch, or null if missing. */
export async function readFile(
  config: GitHubConfig,
  filePath: string
): Promise<string | null> {
  const octokit = await getOctokit(config.token);
  try {
    const res = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: filePath,
      ref: config.branch,
    });
    if (!Array.isArray(res.data) && "content" in res.data && res.data.content) {
      return Buffer.from(res.data.content, "base64").toString("utf8");
    }
    return null;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "status" in err && err.status === 404) {
      return null;
    }
    throw err;
  }
}
