// Tags are written in lowercase in each post's frontmatter (tags: ["ai", "engineering"]).
// This is how each one is shown; a tag missing here is shown capitalized.
const LABELS = {
  ai: "AI",
}

export const tagLabel = tag =>
  LABELS[tag] || tag.charAt(0).toUpperCase() + tag.slice(1)

export const tagPath = tag => `/?tag=${encodeURIComponent(tag)}`
