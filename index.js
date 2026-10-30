#!/usr/bin/env node
import { readFileSync } from "node:fs"
import { pathToFileURL } from "node:url"

export function slugify(heading) {
  return heading
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
}

export function toc(markdown, { maxDepth = 3 } = {}) {
  const entries = []
  let inFence = false
  for (const line of markdown.split("\n")) {
    if (line.startsWith("```")) inFence = !inFence
    const match = !inFence && /^(#{2,6})\s+(.+?)\s*#*$/.exec(line)
    if (!match) continue
    const depth = match[1].length
    if (depth > maxDepth) continue
    entries.push(`${"  ".repeat(depth - 2)}- [${match[2]}](#${slugify(match[2])})`)
  }
  return entries.join("\n")
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = process.argv[2]
  if (!file) {
    console.error("usage: md-toc <file.md>")
    process.exit(2)
  }
  console.log(toc(readFileSync(file, "utf8")))
}
