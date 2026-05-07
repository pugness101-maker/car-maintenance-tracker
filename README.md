# Car Maintenance Tracker

A browser-based car maintenance tracker for vehicles, service history, recurring maintenance, tire tracking, and garage records.

## Run As A Local Website

From this folder, run:

```bash
npm start
```

Then open:

```text
http://localhost:3001
```

You can also run the server directly:

```bash
python3 -m http.server 3001 --directory www
```

## Data Storage

The app currently saves data in your browser storage. If you open the app from a different browser or device, it will have separate saved data unless a backend/database is added later.

## Supabase Login And Cloud Sync

This app is wired for Supabase Auth and a simple per-user cloud state table.

1. Open your Supabase project.
2. Go to SQL Editor.
3. Run the SQL in `supabase-schema.sql`.
4. Refresh the app.
5. Use the Account panel to sign up or log in.

After login, use `Save cloud` to push the current tracker data to Supabase and `Load cloud` to restore it on another browser or device.

## Install As An App

After deploying to Netlify, open the site on a phone or desktop browser.

- iPhone Safari: tap Share, then `Add to Home Screen`.
- Android Chrome: tap the menu, then `Install app` or `Add to Home screen`.
- Desktop Chrome: use the install icon in the address bar when available.
