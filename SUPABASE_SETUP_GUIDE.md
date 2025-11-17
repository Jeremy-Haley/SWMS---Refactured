# Supabase Integration Setup Guide

## 🎯 What You'll Get

- ☁️ Cloud storage for all SWMS documents
- 🔄 Real-time updates when workers sign off
- 📱 Working QR code sign-off system
- 🌐 Access from any device
- 💾 Automatic backups
- 🔒 Secure data storage

## 📋 Prerequisites

1. Supabase account (free tier works great!)
2. Supabase project created

## 🚀 Setup Steps

### Step 1: Install Dependencies

Add Supabase client to your project:

```bash
npm install @supabase/supabase-js
```

Also install React Router for the sign-off page:

```bash
npm install react-router-dom
```

### Step 2: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon)
3. Go to "API" section
4. Copy these two values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon/public key** (long string starting with "eyJ...")

### Step 3: Create Environment Variables

Create a file called `.env` in your project root:

```env
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:** Add `.env` to your `.gitignore` file to keep your keys secure!

### Step 4: Run Database Schema

1. Open Supabase Dashboard
2. Go to "SQL Editor"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into SQL Editor
5. Click "Run" button
6. Wait for confirmation message

This creates:
- `swms_documents` table
- `swms_signoffs` table
- Proper indexes for performance
- Row Level Security policies
- Helper functions and views

### Step 5: Update Your App to Use Supabase

Replace your import in `App.jsx`:

**OLD:**
```javascript
import { useSWMSManager } from './hooks/useSWMSManager';
```

**NEW:**
```javascript
import { useSWMSManager } from './hooks/useSWMSManagerSupabase';
```

Or rename the file:
```bash
mv src/hooks/useSWMSManager.js src/hooks/useSWMSManager.backup.js
mv src/hooks/useSWMSManagerSupabase.js src/hooks/useSWMSManager.js
```

### Step 6: Add Routing for Sign-Off Page

Update your `index.jsx` or `App.jsx` to include routes:

```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WorkerSignOffPage } from './pages/WorkerSignOffPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<YourMainApp />} />
        <Route path="/sign-off/:swmsId" element={<WorkerSignOffPage />} />
      </Routes>
    </Router>
  );
}
```

### Step 7: Update Supabase Client

Edit `src/utils/supabaseClient.js` and replace the placeholder values with your actual credentials (or they'll be loaded from .env automatically).

## 🎉 You're Done!

### Test It Out:

1. **Create a SWMS** - Save it and note the ID
2. **Generate QR Code** - Click the purple "Generate QR Code" button
3. **Scan QR Code** - Use your phone to scan
4. **Sign Off** - Enter name and position, submit
5. **See Real-time Update** - The sign-off appears instantly!

## 📊 Database Structure

### swms_documents Table
- Stores all SWMS documents
- Includes project details, company info, emergency contacts
- Job steps stored as JSONB for flexibility

### swms_signoffs Table
- Stores worker sign-offs
- Links to SWMS document via foreign key
- Includes timestamp and worker details

## 🔒 Security Notes

### Current Setup (Open Access)
The schema includes policies that allow anyone to read/write. This is fine for:
- Internal company use
- Testing and development
- Small teams

### For Production (Recommended Changes):
You may want to add authentication:

1. Enable Supabase Auth
2. Update RLS policies to require authentication
3. Add user roles (admin, supervisor, worker)
4. Restrict document creation to authenticated users

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- Check your .env file has correct credentials
- Verify REACT_APP_ prefix is present
- Restart development server after adding .env

### "Row Level Security" errors
- Make sure you ran the complete SQL schema
- Check policies are enabled in Supabase dashboard
- Verify anon key has proper permissions

### QR Code not working
- Ensure your app is deployed (localhost won't work for mobile QR scans)
- Check the sign-off route is properly configured
- Verify the SWMS ID is being passed correctly

## 📱 Deploying for QR Codes to Work

QR codes need a public URL. Deploy to:

- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Drag build folder
- **GitHub Pages**: Configure in repo settings

After deployment, the QR codes will link to:
`https://your-domain.com/sign-off/[swms-id]`

## 💡 Next Features You Can Add

With Supabase setup, you can now easily add:

- **User Authentication** - Supabase Auth
- **Email Notifications** - When workers sign off
- **Photo Attachments** - Upload site photos
- **Offline Mode** - Using Supabase Local Storage
- **Analytics Dashboard** - Track sign-off compliance
- **Export to PDF** - Generate PDFs server-side
- **Multi-company** - Add company_id field

## 🔄 Migration from localStorage

Your old localStorage data won't automatically transfer. To migrate:

1. Export existing SWMS from localStorage
2. Use Supabase API to bulk insert
3. Or manually recreate important documents

## ❓ Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- React Router Docs: https://reactrouter.com

---

**You're now running a professional, cloud-based SWMS management system!** 🎉
