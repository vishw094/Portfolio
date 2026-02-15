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

### 5. Enable GitHub Pages
- Open your repo on GitHub
- Go to **Settings** → **Pages**
- Under **Source**, choose **Deploy from a branch**
- **Branch**: `main`, **Folder**: `/ (root)`
- Click **Save**

Your site will be live at:
**https://YOUR_USERNAME.github.io/vishw-portfolio/**

(It may take 1–2 minutes to deploy.)
