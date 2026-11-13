
/* =====================================================
   I7 CLAN — PUBLIC WEBSITE CONTENT RENDERER
   Loads sections saved through the Admin Panel.
===================================================== */

import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
  "https://ffraztjbqywsntmfftjb.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_jpHu9S1s37hAZRkmMDrfpw_yAGupnrZ";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* Determine which page is open */
const pageKey = window.location.pathname
  .toLowerCase()
  .endsWith("member.html")
    ? "member"
    : "index";

/* Add renderer styles */
const style = document.createElement("style");

style.textContent = `
  .site-content-section {
    width: 100%;
    padding: 35px 20px;
  }

  .site-content-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 35px;
    background: #111111;
    border: 1px solid #292929;
    border-radius: 14px;
  }

  .site-content-section.cta .site-content-inner {
    border-color: #b81731;
    text-align: center;
  }

  .site-content-section h2 {
    color: #ffffff;
    font-size: clamp(23px, 4vw, 34px);
    margin-bottom: 14px;
  }

  .site-content-section p {
    color: #a5a5a5;
    font-size: 15px;
    line-height: 1.8;
    white-space: pre-line;
  }

  .site-content-button {
    display: inline-block;
    margin-top: 22px;
    padding: 13px 24px;
    background: #ff304f;
    color: #ffffff;
    text-decoration: none;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 1px;
    border-radius: 7px;
    transition: 0.2s ease;
  }

  .site-content-button:hover {
    background: #b81731;
    transform: translateY(-2px);
  }

  @media(max-width: 600px) {
    .site-content-section {
      padding: 22px 14px;
    }

    .site-content-inner {
      padding: 24px 19px;
    }
  }
`;

document.head.appendChild(style);

/* Check button links before displaying them */
function getSafeUrl(value) {
  if (!value) return null;

  const trimmed = value.trim();

  if (
    trimmed.startsWith("#") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("./") ||
    trimmed.startsWith("../")
  ) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    const allowedHosts = [
      "roblox.com",
      "www.roblox.com",
      "discord.gg",
      "youtube.com",
      "www.youtube.com",
      "instagram.com",
      "www.instagram.com"
    ];

    if (
      url.protocol === "https:" &&
      allowedHosts.includes(url.hostname)
    ) {
      return url.href;
    }
  } catch {
    return null;
  }

  return null;
}

/* Create one section safely */
function createSection(record) {
  const section = document.createElement("section");

  section.className =
    "site-content-section " +
    (record.section_type === "cta" ? "cta" : "text");

  section.dataset.sectionKey = record.section_key || "";

  const inner = document.createElement("div");
  inner.className = "site-content-inner";

  const heading = document.createElement("h2");
  heading.textContent = record.title || "";

  inner.appendChild(heading);

  if (record.body) {
    const paragraph = document.createElement("p");
    paragraph.textContent = record.body;
    inner.appendChild(paragraph);
  }

  if (record.button_text && record.button_url) {
    const safeUrl = getSafeUrl(record.button_url);

    if (safeUrl) {
      const button = document.createElement("a");

      button.className = "site-content-button";
      button.textContent = record.button_text;
      button.href = safeUrl;

      if (/^https:\/\//i.test(safeUrl)) {
        button.target = "_blank";
        button.rel = "noopener noreferrer";
      }

      inner.appendChild(button);
    }
  }

  section.appendChild(inner);

  return section;
}

/* Load and display saved sections */
async function loadSiteContent() {
  const footer = document.querySelector("footer");

  if (!footer) {
    console.error("I7 content renderer: Footer not found.");
    return;
  }

  const container = document.createElement("div");
  container.id = "dynamicSiteSections";

  footer.before(container);

  const { data, error } = await supabase
    .from("site_content")
    .select(`
      section_key,
      section_type,
      title,
      body,
      button_text,
      button_url,
      sort_order
    `)
    .eq("page_key", pageKey)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error(
      "I7 website content loading error:",
      error
    );
    return;
  }

  (data || []).forEach(record => {
    container.appendChild(createSection(record));
  });

  console.log(
    `I7 Website Editor: Loaded ${data.length} sections for ${pageKey}.`
  );
}

/* Start */
loadSiteContent();

