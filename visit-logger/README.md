# Visit logger

Each portfolio visit becomes a row in a Google Sheet, and you get one summary email a day covering the
last 24 hours (no email on days without visits). It's free and has no monthly cap.

A visit is logged only after the visitor scrolls, moves the mouse, taps or presses a key, so link
scanners and crawlers aren't counted. Your own visits aren't logged once you've opened the site with
`?me` on that browser.

## Setup (about 5 minutes, once)

1. Create a new Google Sheet, for example **Portfolio visits**.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the sample code, paste everything from `Code.gs`, and click **Save**.
4. In the function dropdown at the top, pick **setup** and click **Run**. Google asks you to authorize
   the script: choose your account, then **Advanced → Go to (project name) → Allow**. This creates the
   **Visits** tab and the daily summary trigger.
5. Click **Deploy → New deployment**, choose the type **Web app**, and set:
   - **Execute as:** Me
   - **Who has access:** Anyone
6. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
7. In `index.html`, paste that URL into `<meta name="visit-log-url" content="...">`, then commit and push.

Opening the web app URL in a browser should show "Visit logger is running."

## Settings

At the top of `Code.gs`:

| Setting | Default | What it does |
|---|---|---|
| `SUMMARY_HOUR` | `8` | Hour of the daily summary email (Los Angeles time) |
| `INSTANT_EMAIL` | `false` | `true` also emails you on every visit. Gmail allows about 100 emails a day |
| `MAX_PER_MINUTE` | `30` | Drops requests beyond this many per minute, so a script can't flood the sheet |
| `TOKEN` | `pv-k7m2q9` | Must match `visit-log-token` in `index.html` |

After changing `Code.gs`, use **Deploy → Manage deployments → Edit → Version: New version → Deploy**
so the same URL serves the new code.

## Notes

- The web app URL and token are visible in the page source, so they only keep out casual misuse. The
  flood guard and the 300-character limit per field cap the damage if someone posts junk to it.
- Location comes from ipapi.co in the visitor's browser and is approximate.
