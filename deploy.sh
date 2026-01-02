#!/bin/bash

# Build the Angular app
ng build

# Copy build output to the GitHub Pages repo, preserving CNAME and .git
rsync -av --delete \
  --exclude='.git' \
  --exclude='CNAME' \
  --exclude='README.md' \
  --exclude='404.html' \
  dist/personalwebsite-repo/browser/ ~/Desktop/personalwebsite/

# Fix base href for GitHub Pages
sed -i 's|<base href="/">|<base href="">|g' ~/Desktop/personalwebsite/index.html

# Copy index.html to 404.html for SPA routing
cp ~/Desktop/personalwebsite/index.html ~/Desktop/personalwebsite/404.html

# Commit and push
cd ~/Desktop/personalwebsite
git add .
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M:%S')"
git push
