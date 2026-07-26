// Publish content.json straight to the GitHub repo via the REST Contents API.
// A commit to public/content.json on `main` triggers the Pages deploy workflow,
// so edits go live for everyone ~1 min later. No backend server required.
//
// The token lives ONLY in the owner's browser (localStorage). Use a fine-grained
// Personal Access Token scoped to just this repo with "Contents: Read and write".

const API = "https://api.github.com";

// UTF-8 safe base64 (content.json may contain unicode).
function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

// Guess owner/repo from a GitHub Pages URL (https://owner.github.io/repo/).
export function detectRepo() {
  try {
    const host = location.hostname; // owner.github.io
    const owner = host.endsWith(".github.io") ? host.split(".")[0] : "";
    const seg = location.pathname.split("/").filter(Boolean)[0] || "";
    // user/org page (owner.github.io) serves from repo "owner.github.io"
    const repo = host.endsWith(".github.io") && !seg ? `${owner}.github.io` : seg;
    return { owner, repo };
  } catch {
    return { owner: "", repo: "" };
  }
}

async function ghFetch(path, token, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  return res;
}

/**
 * Publish the given content object as public/content.json.
 * Returns { ok, commitUrl } or throws Error with a friendly message.
 */
export async function publishContent({ owner, repo, branch = "main", path = "public/content.json", token, content }) {
  if (!owner || !repo) throw new Error("Set your GitHub owner and repo first.");
  if (!token) throw new Error("Add a GitHub token first.");

  const filePath = `/repos/${owner}/${repo}/contents/${path}`;
  const json = JSON.stringify(content, null, 2);

  // 1) look up existing file SHA (needed to update; 404 = new file)
  let sha;
  const getRes = await ghFetch(`${filePath}?ref=${encodeURIComponent(branch)}`, token);
  if (getRes.status === 200) {
    sha = (await getRes.json()).sha;
  } else if (getRes.status === 401) {
    throw new Error("Token rejected (401). Check the token and its scope.");
  } else if (getRes.status === 404) {
    sha = undefined; // creating for the first time
  } else if (getRes.status === 403) {
    throw new Error("Access denied (403). The token needs Contents: Read and write on this repo.");
  }

  // 2) create/update the file (this is a push -> triggers the deploy workflow)
  const putRes = await ghFetch(filePath, token, {
    method: "PUT",
    body: JSON.stringify({
      message: "Update site content via admin panel",
      content: toBase64(json),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (putRes.status === 200 || putRes.status === 201) {
    const data = await putRes.json();
    return { ok: true, commitUrl: data.commit?.html_url };
  }
  if (putRes.status === 401) throw new Error("Token rejected (401).");
  if (putRes.status === 403) throw new Error("Access denied (403). Token needs Contents: write on this repo.");
  if (putRes.status === 404) throw new Error("Repo or branch not found (404). Check owner/repo/branch.");
  if (putRes.status === 409) throw new Error("Conflict (409) — the file changed on GitHub. Try again.");
  const err = await putRes.json().catch(() => ({}));
  throw new Error(err.message || `Publish failed (${putRes.status}).`);
}

/** Verify a token can read the repo. Returns true/false. */
export async function testAccess({ owner, repo, token }) {
  if (!owner || !repo || !token) return false;
  const res = await ghFetch(`/repos/${owner}/${repo}`, token);
  return res.status === 200;
}
