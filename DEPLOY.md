# Deploy Portfolio to GitHub Pages

## Prerequisites
- [Git](https://git-scm.com/downloads) installed
- [GitHub account](https://github.com)

## Steps

### 1. Initialize Git (if not done)
```bash
cd D:\Resume
git init
```

### 2. Add files and commit
```bash
git add .
git commit -m "Initial commit: portfolio website"
```

### 3. Create GitHub repo and push
- Go to [github.com/new](https://github.com/new)
- Name it `vishw-portfolio` (or any name)
- **Do NOT** add README, .gitignore, or license
- Click **Create repository**

### 4. Push your code
```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vishw-portfolio.git
git push -u origin main
```
Replace `YOUR_USERNAME` with your GitHub username (e.g. `vishw094`).

### 5. Enable GitHub Pages (required for the site to appear)
1. Open **https://github.com/vishw094/Portfolio**
2. Click **Settings** (top menu of the repo)
3. In the left sidebar, click **Pages**
4. Under **"Build and deployment"** → **Source**, select **Deploy from a branch**
5. Under **Branch**: choose **main**, **Folder**: choose **/ (root)**
6. Click **Save**

Your site will be at: **https://vishw094.github.io/Portfolio/**

(First deploy can take 1–3 minutes. Refresh the URL after waiting.)
