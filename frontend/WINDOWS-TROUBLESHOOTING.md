# Windows Development Troubleshooting Guide

## 🚨 Common Issues & Solutions

### Issue 1: Configuration Warnings
```
⚠ Invalid next.config.js options detected: 
⚠     Unrecognized key(s) in object: 'appDir' at "experimental"
⚠ The "images.domains" configuration is deprecated.
```

**Solution:**
These warnings come from cached build files. Clean the cache:

```bash
# Method 1: Use npm script
npm run clean

# Method 2: Use PowerShell script
.\clean-cache.ps1

# Method 3: Use batch file
.\clean-windows.bat

# Method 4: Manual cleanup
Remove-Item -Recurse -Force .next
npm cache clean --force
```

### Issue 2: Windows Cache Errors
```
Error: EINVAL: invalid argument, readlink
```

**Root Cause:** Windows file system issues with symlinks in `.next` directory

**Solutions:**

#### Quick Fix:
```bash
npm run fresh
```

#### Manual Fix:
```powershell
# Stop the dev server (Ctrl+C)
Remove-Item -Recurse -Force .next
npm cache clean --force
npm run dev
```

#### PowerShell Script:
```powershell
.\clean-cache.ps1
npm run dev
```

### Issue 3: Port Already in Use
```
⚠ Port 3000 is in use, trying 3001 instead.
```

**Solutions:**
1. **Let Next.js handle it** - It will automatically use port 3001
2. **Kill the process using port 3000:**
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F
   ```
3. **Use a different port:**
   ```bash
   npm run dev -- -p 3002
   ```

## 🛠️ Available Scripts

### Development Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Cache Management Scripts
```bash
npm run clean        # Clean cache (cross-platform)
npm run fresh        # Clean cache and start dev server
npm run clean:windows    # Windows batch script
npm run fresh:windows    # Windows batch + dev server
```

### PowerShell Scripts
```powershell
.\clean-cache.ps1    # PowerShell cache cleaner
.\clean-windows.bat  # Batch file cache cleaner
```

## 🔧 Windows-Specific Solutions

### 1. Enable Developer Mode (Recommended)
- Open Settings → Update & Security → For developers
- Enable "Developer Mode"
- This helps with symlink issues

### 2. Run as Administrator
If you continue having issues:
- Right-click PowerShell/Command Prompt
- Select "Run as Administrator"
- Navigate to project folder
- Run commands

### 3. Use PowerShell Instead of CMD
PowerShell generally handles Node.js better than Command Prompt:
```powershell
# Open PowerShell in project directory
Set-Location "C:\path\to\your\project\frontend"
npm run dev
```

## 📁 File Structure for Cache Files

```
frontend/
├── .next/                 # Next.js build cache (auto-generated)
├── node_modules/          # Dependencies
├── clean-cache.ps1        # PowerShell cleaner
├── clean-windows.bat      # Batch file cleaner
├── next.config.js         # Next.js configuration
└── package.json           # Project configuration
```

## 🚀 Best Practices for Windows Development

### 1. Regular Cache Cleaning
Run cache cleaning weekly or when you encounter issues:
```bash
npm run clean
```

### 2. Use Short Paths
Avoid very long file paths (Windows 260 character limit):
- ✅ `C:\dev\bookstore\frontend`
- ❌ `C:\Users\VeryLongUsername\OneDrive\Desktop\Very Long Project Name\book-shop\frontend`

### 3. Antivirus Exclusions
Add these folders to your antivirus exclusions:
- `node_modules/`
- `.next/`
- Your entire project folder

### 4. Use WSL2 (Alternative)
For a more Unix-like experience:
```bash
# Install WSL2 and Ubuntu
wsl --install
# Then run your project in WSL2
```

## 🐛 Debugging Steps

### Step 1: Check Node.js Version
```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

### Step 2: Clean Everything
```bash
npm run clean
rm -rf node_modules  # or Remove-Item -Recurse -Force node_modules
npm install
```

### Step 3: Check for Global Issues
```bash
npm list -g --depth=0  # Check global packages
npm cache verify       # Verify npm cache
```

### Step 4: Environment Check
```bash
echo $env:NODE_ENV     # Should be empty or 'development'
echo $env:PATH         # Check if Node.js is in PATH
```

## 📞 Getting Help

If you're still having issues:

1. **Check the logs** - Look for specific error messages
2. **Try WSL2** - Often resolves Windows-specific issues
3. **Update dependencies** - `npm update`
4. **Reinstall Node.js** - Download latest LTS from nodejs.org

## ✅ Success Indicators

You know everything is working when you see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
✓ Ready in 3s
```

**No warnings or errors should appear!**