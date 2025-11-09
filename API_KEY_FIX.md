# API Key Mismatch Fix

## Problem Identified

Your `.env` file has a **project ID mismatch**:

- ✅ **URL**: `https://mrkcsaursmbvwpfzqdua.supabase.co` (correct - new project)
- ❌ **Anon Key**: From old project `hshxhpsudutenocclpws` (wrong!)

The anon key in your `.env` file is from the **old Supabase project**, but the URL points to the **new project**. This causes the "invalid API key" error.

## Solution

### Step 1: Get the Correct Anon Key

1. Go to your Supabase dashboard:
   https://app.supabase.com/project/mrkcsaursmbvwpfzqdua/settings/api

2. In the **API Settings** page, find the **"anon public"** key (NOT the service_role key)

3. Copy the entire key (it should start with `eyJ`)

### Step 2: Update Your .env File

Replace the `VITE_SUPABASE_ANON_KEY` value in your `.env` file:

```env
VITE_SUPABASE_URL=https://mrkcsaursmbvwpfzqdua.supabase.co
VITE_SUPABASE_ANON_KEY=<paste the new anon key here>
```

**Important:**
- Make sure there are no quotes around the values
- No spaces around the `=` sign
- The key should be a long JWT token starting with `eyJ`

### Step 3: Restart Dev Server

Vite only loads `.env` files when the dev server starts:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Verify

After restarting, check the browser console. You should see:

```
✅ [Supabase Client] Successfully initialized:
   URL: https://mrkcsaursmbvwpfzqdua.supabase.co
   Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Project ID: mrkcsaursmbvwpfzqdua
✅ API key matches project URL
```

If you see:
```
❌ CRITICAL: API Key Mismatch!
   URL project ID: mrkcsaursmbvwpfzqdua
   Key project ID: hshxhpsudutenocclpws
```

Then the key is still wrong - make sure you copied the key from the **new project** dashboard.

## Enhanced Validation

The code now includes automatic validation that:
- ✅ Checks if the anon key matches the project URL
- ✅ Validates JWT token format
- ✅ Provides clear error messages with links to fix the issue
- ✅ Logs detailed debugging information in development mode

## Testing

After updating the key:
1. Try to sign up with a new email
2. Try to sign in
3. Both should work without "invalid API key" errors

If you still see errors, check:
- Browser console for detailed error messages
- Network tab to see what URL/key is being sent
- That you restarted the dev server after updating .env

