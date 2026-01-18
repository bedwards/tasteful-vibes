#!/usr/bin/env node

/**
 * Fetch repository metadata from GitHub for all Brian Edwards' repos
 * Run with: node scripts/fetch-repos.js
 * Outputs to: src/data/repos.json
 */

const fs = require('fs');
const path = require('path');

const GITHUB_API = 'https://api.github.com';

// Accounts and orgs to fetch
const SOURCES = [
  { type: 'user', name: 'bedwards' },
  { type: 'user', name: 'bme-wacoisd' },
  { type: 'org', name: 'audio-forge-rs' },
  { type: 'org', name: 'bridgenet-tech' },
  { type: 'org', name: 'neighborhood-lab' },
  { type: 'org', name: 'opensky-suite' },
  { type: 'org', name: 'JalopyMusic' },
  { type: 'org', name: 'kindled-path' },
  { type: 'org', name: 'undertow-ink' },
  { type: 'org', name: 'the-ei' },
  { type: 'org', name: 'Fable-Frontiers' },
  { type: 'org', name: 'splash-screen-studio' },
  { type: 'org', name: 'The-Story-of-a-Noble-Family' },
  { type: 'org', name: 'world-stitchers' },
];

// Vertical categorization based on repo name/description
const VERTICALS = {
  education: ['classroom', 'school', 'lesson', 'student', 'teacher', 'education', 'elementary', 'tea'],
  healthcare: ['folk', 'care', 'health', 'medical', 'evv', 'patient'],
  music: ['audio', 'music', 'bitwig', 'vst', 'clap', 'plugin', 'groove', 'ghost-note', 'midi', 'synth', 'daw'],
  gaming: ['roblox', 'game', 'fable', 'story', 'world-stitchers', 'splash-screen'],
  'data-science': ['kaggle', 'ml', 'data', 'graph', 'neural', 'ai', 'model'],
  ecommerce: ['shopify', 'commerce', 'shop', 'store'],
};

function categorizeRepo(repo) {
  const searchText = `${repo.name} ${repo.description || ''}`.toLowerCase();

  for (const [vertical, keywords] of Object.entries(VERTICALS)) {
    if (keywords.some(kw => searchText.includes(kw))) {
      return vertical;
    }
  }
  return 'other';
}

async function fetchRepos(source) {
  const endpoint = source.type === 'user'
    ? `${GITHUB_API}/users/${source.name}/repos`
    : `${GITHUB_API}/orgs/${source.name}/repos`;

  const allRepos = [];
  let page = 1;

  while (true) {
    const url = `${endpoint}?per_page=100&page=${page}`;
    console.log(`Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'tasteful-vibes-repo-fetcher',
        ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {}),
      },
    });

    if (!response.ok) {
      console.error(`Error fetching ${source.name}: ${response.status}`);
      break;
    }

    const repos = await response.json();
    if (repos.length === 0) break;

    allRepos.push(...repos);
    page++;

    // Rate limiting protection
    await new Promise(r => setTimeout(r, 100));
  }

  return allRepos.map(repo => ({
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    size: repo.size, // in KB
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    topics: repo.topics || [],
    isPrivate: repo.private,
    isFork: repo.fork,
    source: source.name,
    sourceType: source.type,
    vertical: categorizeRepo(repo),
  }));
}

async function main() {
  console.log('Fetching repository metadata...\n');

  const allRepos = [];

  for (const source of SOURCES) {
    console.log(`\n--- ${source.type}: ${source.name} ---`);
    try {
      const repos = await fetchRepos(source);
      console.log(`Found ${repos.length} repos`);
      allRepos.push(...repos);
    } catch (error) {
      console.error(`Failed to fetch ${source.name}:`, error.message);
    }
  }

  // Filter out private and forked repos (unless from main account)
  const publicRepos = allRepos.filter(r => !r.isPrivate);

  // Sort by most recently updated
  publicRepos.sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));

  // Calculate stats
  const stats = {
    totalRepos: publicRepos.length,
    totalSize: publicRepos.reduce((sum, r) => sum + r.size, 0),
    totalStars: publicRepos.reduce((sum, r) => sum + r.stars, 0),
    byVertical: {},
    byLanguage: {},
    bySource: {},
  };

  for (const repo of publicRepos) {
    stats.byVertical[repo.vertical] = (stats.byVertical[repo.vertical] || 0) + 1;
    if (repo.language) {
      stats.byLanguage[repo.language] = (stats.byLanguage[repo.language] || 0) + 1;
    }
    stats.bySource[repo.source] = (stats.bySource[repo.source] || 0) + 1;
  }

  const output = {
    generatedAt: new Date().toISOString(),
    stats,
    repos: publicRepos,
  };

  // Ensure data directory exists
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write output
  const outputPath = path.join(dataDir, 'repos.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n=== Summary ===`);
  console.log(`Total repos: ${stats.totalRepos}`);
  console.log(`Total size: ${(stats.totalSize / 1024).toFixed(1)} MB`);
  console.log(`Total stars: ${stats.totalStars}`);
  console.log(`\nBy vertical:`, stats.byVertical);
  console.log(`By language:`, stats.byLanguage);
  console.log(`\nOutput written to: ${outputPath}`);
}

main().catch(console.error);
