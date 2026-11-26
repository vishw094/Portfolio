// Portfolio visit logger: a Google Apps Script web app, bound to a Google Sheet.
// Each portfolio visit is appended as a row, and a summary of the last 24 hours is
// emailed once a day (no email on days without visits). Setup: visit-logger/README.md.

const CONFIG = {
  SHEET_NAME: "Visits",
  TOKEN: "pv-k7m2q9",          // must match <meta name="visit-log-token"> in index.html
  TIMEZONE: "America/Los_Angeles",
  SUMMARY_HOUR: 8,             // daily summary email around 8 AM in TIMEZONE
  INSTANT_EMAIL: false,        // true = also email on every visit (Gmail allows about 100 emails a day)
  MAX_PER_MINUTE: 30,          // flood guard: requests beyond this in the same minute are dropped
};

const HEADERS = ["Time", "Page", "Came from", "City", "Region", "ZIP", "Country",
                 "Network / company", "Device", "User agent"];

// Run once from the Apps Script editor: creates the sheet and the daily summary trigger.
function setup() {
  SpreadsheetApp.getActive().setSpreadsheetTimeZone(CONFIG.TIMEZONE);
  getSheet_();
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === "sendDailySummary")
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("sendDailySummary").timeBased().everyDays(1)
    .atHour(CONFIG.SUMMARY_HOUR).inTimezone(CONFIG.TIMEZONE).create();
  Logger.log("Ready. Daily summary goes to %s around %s:00 (%s).",
             Session.getEffectiveUser().getEmail(), CONFIG.SUMMARY_HOUR, CONFIG.TIMEZONE);
}

// Opening the web app URL in a browser shows this, which is a quick way to check the deployment.
function doGet() {
  return ContentService.createTextOutput("Visit logger is running.");
}

function doPost(e) {
  let d;
  try {
    d = JSON.parse(e.postData.contents);
  } catch (err) {
    return ok_();
  }
  if (!d || d.token !== CONFIG.TOKEN || tooMany_()) return ok_();

  const row = [new Date(), d.page, d.referrer, d.city, d.region, d.postal, d.country,
               d.org, d.device, d.userAgent].map((v, i) => (i === 0 ? v : cell_(v)));
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_().appendRow(row);
  } finally {
    lock.releaseLock();
  }

  if (CONFIG.INSTANT_EMAIL) {
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(),
                      "Portfolio visit from " + (d.city || d.country || "somewhere"),
                      describe_(row));
  }
  return ok_();
}

// Daily trigger: email the visits from the last 24 hours, if there were any.
function sendDailySummary() {
  const sheet = getSheet_();
  const n = sheet.getLastRow() - 1;
  if (n < 1) return;
  const since = Date.now() - 24 * 60 * 60 * 1000;
  const recent = sheet.getRange(2, 1, n, HEADERS.length).getValues()
    .filter(r => r[0] instanceof Date && r[0].getTime() >= since);
  if (!recent.length) return;

  const lines = recent.map(describe_);
  const body = recent.length + " portfolio visit" + (recent.length === 1 ? "" : "s") +
    " in the last 24 hours:\n\n" + lines.join("\n\n") +
    "\n\nAll visits: " + SpreadsheetApp.getActive().getUrl() +
    "\n\nLocation is estimated from the visitor's internet connection, so city and ZIP are approximate.";
  MailApp.sendEmail(Session.getEffectiveUser().getEmail(),
                    "Portfolio: " + recent.length + " visit" + (recent.length === 1 ? "" : "s") + " in the last 24 hours",
                    body);
}

function describe_(r) {
  const when = Utilities.formatDate(r[0], CONFIG.TIMEZONE, "EEE MMM d, h:mm a");
  const place = [r[3], r[4], r[6]].filter(String).join(", ") || "Unknown location";
  return when + "  ·  " + place + "\n" +
         "   " + (r[7] || "unknown network") + "  ·  " + (r[8] || "unknown device") + "\n" +
         "   " + r[1] + "  (from " + (r[2] || "direct") + ")";
}

function getSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.getRange("A:A").setNumberFormat("yyyy-mm-dd hh:mm");
  }
  return sheet;
}

// Visitor-supplied text: cap the length, and stop values like "=HYPERLINK(...)" becoming formulas.
function cell_(v) {
  const s = String(v == null ? "" : v).slice(0, 300);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function tooMany_() {
  const cache = CacheService.getScriptCache();
  const key = "m" + Math.floor(Date.now() / 60000);
  const count = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(count), 120);
  return count > CONFIG.MAX_PER_MINUTE;
}

function ok_() {
  return ContentService.createTextOutput("ok");
}
