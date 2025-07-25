# 🔍 Auth Debug Guide

The 500 error from `/auth/v1/token?grant_type=password` suggests an auth configuration issue.

## Steps to Debug:

### 1. **Check Your Vercel Environment Variables**
Go to your Vercel dashboard and verify these exact values:

```
NEXT_PUBLIC_SUPABASE_URL=https://ovduqknqemrkiebxtisi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92ZHVxa25xZW1ya2llYnh0aXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4OTc5NTUsImV4cCI6MjA2NjQ3Mzk1NX0.fvuZ_8-G_PQ99FKXkTrIuxg7htrj0d31pgT7JIBsky4
```

### 2. **Check Supabase Auth Settings**
In your Supabase dashboard:
- Go to Authentication → Settings
- Verify **Email Auth** is enabled
- Check **Site URL** is set to your Vercel domain
- Verify **Redirect URLs** include your domain

### 3. **Test with Simple Credentials**
Instead of complex passwords, try creating a new test user:

**Email:** demo@cazno.com  
**Password:** demo123

### 4. **Check Auth Policies**
The issue might be RLS policies blocking the auth flow.

### 5. **Direct URL Test**
Try this URL directly in browser to test auth endpoint:
```
https://ovduqknqemrkiebxtisi.supabase.co/auth/v1/health
```

## Likely Causes:

1. **Site URL Mismatch** - Supabase rejects requests from unauthorized domains
2. **Auth Provider Disabled** - Email/password auth might be disabled
3. **JWT Configuration** - Token signing might have issues
4. **CORS Issues** - Cross-origin requests blocked

## Quick Fix Options:

### Option A: Create New User via Supabase Dashboard
1. Go to Authentication → Users in Supabase
2. Click "Add User" 
3. Create user with:
   - Email: demo@cazno.com
   - Password: demo123
   - Auto-confirm: YES

### Option B: Check Site URL Settings
1. Go to Authentication → URL Configuration
2. Add your Vercel domain to allowed origins
3. Set redirect URLs properly

### Option C: Test Locally First
1. Run `npm run dev` locally
2. Test login at `http://localhost:3000/login`
3. If it works locally but not on Vercel, it's a domain/CORS issue

Let me know what you find and I'll help fix the specific issue!