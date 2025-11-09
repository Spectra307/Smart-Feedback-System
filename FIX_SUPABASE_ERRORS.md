# How to Fix Supabase Configuration Errors

## 🔍 Problem Identified

Your `.env` file has a **project ID mismatch**:
- ✅ **URL**: `https://mrkcsaursmbvwpfzqdua.supabase.co` (correct - new project)
- ❌ **Anon Key**: From old project `hshxhpsudutenocclpws` (wrong!)

This causes the "invalid API key" error.

## ✅ Solution - Step by Step

### Step 1: Get the Correct Anon Key

1. **Open your Supabase dashboard:**
   - Go to: https://app.supabase.com/project/mrkcsaursmbvwpfzqdua/settings/api
   - Or: https://app.supabase.com → Select project `mrkcsaursmbvwpfzqdua` → Settings → API

2. **Find the "anon public" key:**
   - Look for the section labeled **"Project API keys"**
   - Find the key labeled **"anon"** or **"public"** (NOT "service_role")
   - The key should be a long JWT token starting with `eyJ`

3. **Copy the entire key** (it's very long, make sure you get all of it)

### Step 2: Update Your .env File

1. **Open your `.env` file** in the project root (same folder as `package.json`)

2. **Replace the `VITE_SUPABASE_ANON_KEY` value** with the new key:

   ```env
   VITE_SUPABASE_URL=https://mrkcsaursmbvwpfzqdua.supabase.co
   VITE_SUPABASE_ANON_KEY=<paste the NEW anon key here>
   ```

   **Important:**
   - ✅ No quotes around the values
   - ✅ No spaces around the `=` sign
   - ✅ Make sure the key is on one line (no line breaks)
   - ✅ The key should start with `eyJ` and be very long

3. **Save the file**

### Step 3: Restart the Dev Server

**Critical:** Vite only loads `.env` files when the dev server starts.

1. **Stop the current dev server:**
   - Press `Ctrl+C` in the terminal where `npm run dev` is running

2. **Start it again:**
   ```bash
   npm run dev
   ```

### Step 4: Verify It's Fixed

1. **Open your browser** and go to your app (usually `http://localhost:5173`)

2. **Open the browser console** (Press `F12` or right-click → Inspect → Console tab)

3. **Look for these success messages:**
   ```
   ✅ [Supabase Client] Successfully initialized:
      URL: https://mrkcsaursmbvwpfzqdua.supabase.co
      Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      Project ID: mrkcsaursmbvwpfzqdua
   ✅ API key matches project URL
   ```

4. **If you still see errors**, check:
   - Did you copy the entire key? (it should be very long)
   - Did you restart the dev server after updating `.env`?
   - Are there any extra spaces or quotes in the `.env` file?

### Step 5: Test Authentication

1. **Try to sign up** with a new email
2. **Try to sign in**
3. Both should work without "invalid API key" errors

## 🐛 Still Having Issues?

### Issue: "Key still doesn't match"

**Check:**
- Make sure you're copying from the **new project** (`mrkcsaursmbvwpfzqdua`), not the old one
- The key should be from the **"anon public"** section, not "service_role"
- Make sure you copied the entire key (it's a very long string)

### Issue: "Variables still showing as missing"

**Check:**
- Is the `.env` file in the project root? (same folder as `package.json`)
- Did you restart the dev server after updating `.env`?
- Are the variable names exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`?
- No typos or extra spaces?

### Issue: "Dev server won't start"

**Try:**
1. Clear Vite cache:
   ```bash
   # Windows PowerShell
   Remove-Item -Recurse -Force node_modules\.vite
   
   # Or manually delete the folder: node_modules\.vite
   ```

2. Restart dev server:
   ```bash
   npm run dev
   ```

## 📝 Quick Reference

**Correct .env format:**
```env
VITE_SUPABASE_URL=https://mrkcsaursmbvwpfzqdua.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ya2NzYXVyc21idndwZnpxZHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDc1MDUsImV4cCI6MjA3NjA4MzUwNX0.xxxxx
```

**Where to get the key:**
- Dashboard: https://app.supabase.com/project/mrkcsaursmbvwpfzqdua/settings/api
- Look for: "anon" or "public" key (NOT "service_role")

**After updating:**
- Always restart: `npm run dev`
- Check console for success messages

