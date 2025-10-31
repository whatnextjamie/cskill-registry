#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const REPOSITORIES_FILE = path.join(__dirname, '../repositories.json');
const OUTPUT_FILE = path.join(__dirname, '../index.json');

async function fetchSkillPackage(repoUrl, branch = 'main') {
  // Convert git URL to raw GitHub URL
  const githubUrl = repoUrl
    .replace('https://github.com/', '')
    .replace('.git', '');

  const rawUrl = `https://raw.githubusercontent.com/${githubUrl}/${branch}/skill-package.json`;

  console.log(`Fetching: ${rawUrl}`);

  return new Promise((resolve, reject) => {
    https.get(rawUrl, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${rawUrl}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Invalid JSON from ${rawUrl}: ${error.message}`));
        }
      });
    }).on('error', reject);
  });
}

function convertToRegistryEntry(skillPackage, repoUrl) {
  // Extract package info
  const entry = {
    name: skillPackage.name,
    version: skillPackage.version,
    description: skillPackage.description,
    author: skillPackage.author,
    repository: repoUrl,
    keywords: skillPackage.keywords || [],
    skills: (skillPackage.skills || []).map(skill => skill.name),
    claudeCode: skillPackage.claudeCode || {}
  };

  return entry;
}

async function buildIndex() {
  console.log('Building registry index...\n');

  // Read repositories list
  const repositories = JSON.parse(fs.readFileSync(REPOSITORIES_FILE, 'utf8'));

  // Fetch all skill packages
  const packages = [];
  for (const repo of repositories.repositories) {
    try {
      const skillPackage = await fetchSkillPackage(repo.url, repo.branch);
      const entry = convertToRegistryEntry(skillPackage, repo.url);
      packages.push(entry);
      console.log(`✓ ${entry.name}@${entry.version}`);
    } catch (error) {
      console.error(`✗ Failed to fetch ${repo.url}: ${error.message}`);
      process.exit(1);
    }
  }

  // Build index
  const index = {
    "$schema": "https://raw.githubusercontent.com/whatnextjamie/cskill/main/schema/registry-index.schema.json",
    "version": "1.0.0",
    "updated": new Date().toISOString(),
    "packages": packages
  };

  // Write output
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2) + '\n');

  console.log(`\n✓ Generated index.json with ${packages.length} package(s)`);
  console.log(`  Updated: ${index.updated}`);
}

buildIndex().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
