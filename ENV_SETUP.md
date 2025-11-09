# Environment Variables Setup Guide

## Quick Setup

1. **Create a `.env` file** in the project root (same directory as `package.json`)

2. **Add the following variables:**

```env
VITE_SUPABASE_URL=https://mrkcsaursmbvwpfzqdua.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

3. **Restart the dev server** after creating/updating `.env`:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

## Important Notes

- ✅ **File location**: `.env` must be in the project root (where `package.json` is)
- ✅ **Variable names**: Must start with `VITE_` prefix for Vite to expose them
- ✅ **No spaces**: Don't add spaces around the `=` sign
- ✅ **No quotes needed**: Don't wrap values in quotes unless the value itself contains spaces
- ✅ **Restart required**: Vite only loads `.env` files when the dev server starts

## Verification

When you run `npm run dev`, check the browser console. You should see:

```
[Supabase Client] Environment check:
  VITE_SUPABASE_URL: https://mrkcsaursmbvwpfzqdua.supabase...
  VITE_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  All import.meta.env keys: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', ...]
[Supabase Client] Initializing with URL: https://mrkcsaursmbvwpfzqdua.supabase.co
```

If you see `❌ MISSING` for either variable, the `.env` file is not being loaded correctly.

## Troubleshooting

### Issue: `net::ERR_NAME_NOT_RESOLVED`

**Possible causes:**
1. `.env` file doesn't exist or is in wrong location
2. Variable names are incorrect (must be `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)
3. Dev server wasn't restarted after creating `.env`
4. Typo in the URL (check for extra spaces, wrong domain, etc.)

**Solution:**
1. Verify `.env` file exists in project root
2. Check variable names match exactly (case-sensitive)
3. Stop and restart `npm run dev`
4. Check browser console for the debug logs

### Issue: Environment variables show as `undefined`

**Solution:**
1. Make sure variable names start with `VITE_`
2. Restart the dev server completely
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Check for `.env.local` or other env files that might override

### Issue: Still getting old domain errors

**Solution:**
1. Clear browser localStorage: `localStorage.clear()` in console
2. Clear Vite cache: Delete `node_modules/.vite` folder
3. Restart dev server
4. Hard refresh browser (Ctrl+Shift+R)

## File Structure

Your project should look like this:

```
Smart-Feedback-System/
├── .env                    ← Must be here (project root)
├── package.json
├── vite.config.ts
├── src/
│   └── integrations/
│       └── supabase/
│           └── client.ts   ← Uses import.meta.env.VITE_SUPABASE_URL
└── ...
```

## Getting Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `mrkcsaursmbvwpfzqdua`
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

