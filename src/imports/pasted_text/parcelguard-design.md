Design a complete, modern, production-ready SaaS web application called **"ParcelGuard"** — a **Courier Fraud Detector & Smart Parcel Booking Hub** built specifically for Bangladesh's F-Commerce and e-commerce sellers.

The application helps merchants:

* Detect risky or fraudulent customers before shipping.
* Check customer delivery history using phone numbers.
* Book parcels with multiple courier services from one dashboard.
* Upload and process bulk orders via CSV/Excel.
* Generate invoices, courier labels, and barcode stickers.
* Track parcel delivery status in real time.
* Track COD payments, pending payments, and courier settlements.
* Manage multiple courier accounts.
* Receive automated notifications and alerts.

The design should feel like a premium modern SaaS platform similar in quality to Stripe, Linear, Notion, Shopify Admin, and modern logistics dashboards.

---

# 1. DESIGN SYSTEM

Create a clean, professional, modern B2B SaaS interface.

### Visual Style

* Clean white and light gray background.
* Premium fintech + logistics appearance.
* Minimal but information-rich dashboard.
* Rounded cards with subtle borders.
* Soft shadows only where necessary.
* Spacious layout.
* Clear visual hierarchy.
* Modern table design.
* Responsive desktop-first interface.

### Color Palette

Primary:

* Deep Indigo / Blue: #4F46E5 or similar.
* Primary hover: slightly darker indigo.

Success:

* Green for Safe customers and successful deliveries.

Warning:

* Amber / Orange for Moderate Risk and pending actions.

Danger:

* Red for High Risk, fraud warnings, returned parcels.

Neutral:

* Background: #F8FAFC
* Card: #FFFFFF
* Border: #E2E8F0
* Primary text: #0F172A
* Secondary text: #64748B

Do not overuse colors. Keep the interface elegant and professional.

### Typography

Use a clean modern sans-serif font.

Suggested style:

* Inter
* Large dashboard titles.
* Medium-weight section headings.
* Small but readable table labels.
* Strong number hierarchy for financial metrics.

---

# 2. APPLICATION STRUCTURE

Create the following main layout:

### Left Sidebar Navigation

Logo:
**ParcelGuard**
Small tagline: Smart Courier Intelligence

Navigation items with modern outline icons:

* Overview
* Fraud Checker
* Parcels
* Book Parcel
* Bulk Upload
* Tracking
* Payments
* Courier Accounts
* Customers
* Reports

Bottom section:

* Subscription & Credits
* Notifications
* Settings
* Help Center

Sidebar should be collapsible.

---

# 3. TOP NAVIGATION

Top navigation should contain:

Left:

* Breadcrumb / current page title.

Right:

* Global search.
* Notification bell with unread indicator.
* Help icon.
* Merchant avatar.
* Merchant name.
* Dropdown menu.

Also include a visible button:

**+ Book Parcel**

Use the primary brand color.

---

# 4. OVERVIEW DASHBOARD

Create the main dashboard screen.

Header:

**Good morning, Merchant 👋**
Small subtitle:

"Here's what's happening with your parcels today."

Top-right actions:

* * Book Parcel
* Import Orders

---

## KPI CARDS

Create four premium statistic cards:

### Card 1

**Total Parcels**
1,248

Small trend:
↑ 12.5% vs last month

Icon: package.

---

### Card 2

**Delivered Successfully**
982

Success rate:
78.7%

Green progress indicator.

---

### Card 3

**At Risk / Returned**
86

Red warning indicator.

Subtitle:
"Potential loss: ৳18,450"

---

### Card 4

**Pending COD**
৳245,600

Subtitle:
"Expected settlement this week"

Icon: wallet / banknote.

---

# 5. DELIVERY ANALYTICS SECTION

Create a large analytics card.

Title:

**Parcel Performance**

Include tabs:

* 7 Days
* 30 Days
* 3 Months

Show a clean line chart.

Metrics:

* Created
* In Transit
* Delivered
* Returned

Use a professional logistics analytics visualization.

---

# 6. DELIVERY STATUS OVERVIEW

Create a card with status distribution.

Use horizontal progress bars or donut visualization.

Statuses:

* Pending Pickup
* In Transit
* Out for Delivery
* Delivered
* Returned
* Cancelled

Each status should display:

Count + Percentage.

---

# 7. RECENT PARCELS TABLE

Create a large data table.

Columns:

* Tracking ID
* Customer
* Phone
* Courier
* COD Amount
* Risk Score
* Status
* Created Date
* Action

Example rows:

PG-102845
Rahim Uddin
01XXXXXXXXX
Steadfast
৳1,250
Safe
Delivered

Another row:

PG-102846
Karim Hasan
01XXXXXXXXX
Pathao
৳2,500
High Risk
Returned

Risk score should use badges:

🟢 Safe
🟡 Moderate
🔴 High Risk

Status should also use elegant pill badges.

Actions:

* View
* Track
* More menu

Include pagination.

---

# 8. FRAUD CHECKER PAGE

Create a dedicated premium page called:

# Fraud Checker

Subtitle:

"Check customer delivery history before shipping your parcel."

Create a large search card in the center.

Input:

Customer Phone Number

Country code:
🇧🇩 +880

Placeholder:
Enter mobile number

Primary button:

**Check Risk**

Also include:

* Scan from CSV
* Recent Checks

---

## AFTER SEARCH RESULT

Design a detailed customer risk report.

Header:

Customer Reputation Report

Show:

Phone Number:
+880 17XX-XXXXXX

Overall Risk Score:

**82 / 100**

Large circular score visualization.

Status:

🔴 HIGH RISK

Description:

"This customer has a high return and parcel refusal history."

---

### Statistics

Total Orders:
24

Successfully Received:
9

Returned / Refused:
12

Cancelled:
3

Success Rate:
37.5%

---

### Risk Factors

Create a warning panel:

⚠ Frequent parcel refusal

⚠ Multiple orders from different merchants

⚠ High return ratio

---

### Recommendation Card

Large actionable card:

**Recommended Action**

"Request advance payment before shipping."

Buttons:

* Book Anyway
* Add to Watchlist

---

# 9. BOOK PARCEL PAGE

Create a clean multi-step parcel booking experience.

Page title:

# Book New Parcel

Use a horizontal stepper:

1. Customer Details
2. Parcel Details
3. Courier Selection
4. Review & Confirm

---

## STEP 1 — CUSTOMER DETAILS

Fields:

Customer Name

Phone Number

Full Address

District

Area / Thana

Address Notes

When entering a phone number, automatically show a small fraud indicator beside the input.

Example:

🟢 Safe Customer
Delivery success rate: 92%

Or:

🔴 High Risk Customer
Success rate: 35%

---

## STEP 2 — PARCEL DETAILS

Fields:

Product Name

Product Category

Parcel Weight

Parcel Type

COD Amount

Delivery Charge

Advance Payment

Special Instructions

Add a live summary card:

COD Amount
৳1,500

Delivery Charge
৳120

Expected Merchant Collection
৳1,380

---

# 10. COURIER SELECTION

Create a comparison card system.

Available couriers:

Steadfast

Pathao Courier

RedX

Each courier card should display:

Courier logo area.

Estimated Delivery Time:
1–3 Days

Delivery Charge:
৳120

COD Charge:
1%

Coverage:
64 Districts

Performance Score:
★★★★☆

Buttons:

Select Courier

Recommended courier should have a badge:

⭐ Best Choice

Allow the merchant to compare couriers side-by-side.

---

# 11. PARCEL REVIEW & CONFIRMATION

Create a complete order summary.

Sections:

Customer Information

Parcel Information

Courier Information

Payment Summary

Risk Assessment

At the bottom:

Checkbox:

"I have reviewed the parcel information."

Primary CTA:

**Confirm & Book Parcel**

After booking:

Show success screen.

Large success icon.

Message:

🎉 Parcel Booked Successfully!

Tracking ID:

PG-102845

Buttons:

* Print Label
* Track Parcel
* Book Another Parcel

---

# 12. BULK UPLOAD PAGE

Page title:

# Bulk Parcel Upload

Subtitle:

"Upload hundreds of orders and book them in minutes."

Create a large drag-and-drop upload area.

Supported:

CSV

Excel (.xlsx)

Buttons:

* Download Sample File
* Upload File

---

After upload show:

Upload Summary

Total Orders:
500

Valid Orders:
472

Need Attention:
28

Create a preview table.

Columns:

Customer

Phone

Address

COD

Risk

Courier

Status

Invalid rows should have highlighted validation messages.

Provide:

Fix Errors

Continue Booking

---

# 13. BULK LABEL & BARCODE PAGE

Create a professional printing interface.

Left side:

Parcel selection table.

Checkboxes.

Search.

Filter.

Right side:

Print Preview.

Show an A4 invoice layout and thermal label layout.

Options:

Label Size

* 4×6 inch
* 100×150mm
* A4

Include barcode.

QR code.

Tracking ID.

Customer Name.

Phone.

Address.

Courier Name.

COD amount.

Primary button:

**Print Selected Labels**

Secondary:

Download PDF

---

# 14. PARCEL TRACKING PAGE

Page title:

# Parcel Tracking

Include large search input:

Enter Tracking ID

Example:

PG-102845

---

After search show a timeline.

Order Created

Aug 24, 10:30 AM

↓

Picked Up by Courier

Aug 24, 04:20 PM

↓

Arrived at Dhaka Hub

Aug 25, 09:15 AM

↓

Out for Delivery

Aug 26, 08:10 AM

↓

Delivered

Aug 26, 03:45 PM

Use a vertical modern tracking timeline.

Also show:

Customer Details

Courier Details

COD Amount

Delivery Status

Risk Level

Courier Agent Information if available.

---

# 15. PAYMENTS & RECONCILIATION PAGE

Create a finance dashboard.

Top metrics:

Total COD Collected
৳1,250,000

Pending Settlement
৳245,600

Received This Month
৳780,000

Payment Issues
৳18,500

---

Create a settlement table.

Columns:

Settlement ID

Courier

Period

Expected Amount

Received Amount

Difference

Status

Actions

Statuses:

* Paid
* Pending
* Partial
* Disputed

If there is a mismatch, highlight:

⚠ Payment discrepancy detected

Expected:
৳25,000

Received:
৳22,500

Difference:
৳2,500

Actions:

View Details

Raise Dispute

---

# 16. COURIER ACCOUNTS PAGE

Page title:

# Courier Accounts

Show connected courier services.

Cards:

Steadfast Courier

Status:
🟢 Connected

Available Balance:
৳12,500

Last Sync:
2 minutes ago

Buttons:

Manage

Sync Now

---

Pathao Courier

Status:
🟢 Connected

---

RedX

Status:
⚪ Not Connected

Button:

Connect Account

---

Create an "Add Courier Account" modal.

Fields:

Courier Provider

Merchant API Key

Secret Key

Merchant ID

Enable Webhook

Button:

Connect Account

---

# 17. CUSTOMER DATABASE PAGE

Create a customer intelligence page.

Table:

Customer Name

Phone Number

Total Orders

Delivered

Returned

Success Rate

Risk Level

Last Order

Actions

Add filters:

* All Customers
* Safe
* Moderate Risk
* High Risk
* Watchlist

Customer details drawer should include:

Customer profile.

Order history.

Risk history.

Return pattern.

Associated merchants count if applicable.

Notes.

Button:

Add to Watchlist.

---

# 18. SUBSCRIPTION & CREDITS PAGE

Create SaaS pricing / usage interface.

Current Plan:

**Starter Plan**

Monthly Price:

৳999 / month

Usage:

Fraud Checks

━━━━━━━━━━ 340 / 500

Parcel Bookings

━━━━━━━━━━ 78 / 200

Add-ons:

Buy 100 Fraud Checks

৳199

Buy 500 Fraud Checks

৳799

Buy Booking Credits

৳499

Buttons:

Upgrade Plan

Buy Credits

---

# 19. NOTIFICATIONS CENTER

Create notification categories:

All

Parcels

Payments

Risk Alerts

System

Example notifications:

🔴 High-risk customer detected.

Order PG-102845 has a 28% delivery success rate.

🟢 COD payment received.

৳12,500 has been added to your settlement.

🟠 Parcel delayed.

Tracking ID PG-102721 has been stuck at Dhaka Hub for 48 hours.

---

# 20. REPORTS & ANALYTICS

Create an advanced analytics dashboard.

Include:

Delivery Success Rate

Return Rate

COD Collection Trend

Courier Performance

High Risk Customer Trend

Top Districts

Most Returned Products

Use modern charts.

Add date range selector:

Today

Last 7 Days

Last 30 Days

Custom Range

Allow export:

CSV

Excel

PDF

---

# 21. SETTINGS PAGE

Create sections:

Business Profile

Merchant Name

Business Logo

Phone

Email

Business Address

---

Notification Settings:

* Parcel Updates
* Payment Updates
* High Risk Alerts
* SMS Notifications
* Email Notifications

---

Security:

Change Password

Two-Factor Authentication

Active Sessions

API Access

---

# 22. MOBILE RESPONSIVE DESIGN

Also create responsive mobile layouts for:

* Dashboard
* Fraud Checker
* Book Parcel
* Parcel Tracking

On mobile:

Use bottom navigation.

Important actions should remain easily accessible.

Show simplified tables as cards.

---

# 23. EMPTY STATES

Create polished empty states.

Examples:

No parcels found.

Illustration of a package.

Button:

Book Your First Parcel

---

No courier connected.

Illustration of delivery truck.

Button:

Connect Courier

---

No fraud check history.

Illustration of shield.

Button:

Check a Phone Number

---

# 24. ERROR & WARNING STATES

Create clear UI for:

High Risk Customer

Courier API Connection Failed

Payment Mismatch

Invalid CSV Data

Parcel Booking Failed

Use actionable messages.

Example:

"Something went wrong while booking this parcel."

Buttons:

Try Again

Contact Support

---

# 25. USER EXPERIENCE PRINCIPLES

The application should prioritize:

* Speed.
* Minimal manual data entry.
* Clear risk warnings.
* Fast parcel booking.
* Easy bulk operations.
* Financial transparency.
* Clear status visibility.

Avoid clutter.

Important actions should always be visible.

Risk information must be highly noticeable but should not make the entire interface look alarming.

Use progressive disclosure for advanced features.

The dashboard should feel trustworthy enough for merchants who manage thousands of parcels and significant COD payments.

---

# FINAL DESIGN OUTPUT

Generate a complete high-fidelity SaaS application design with the following screens:

1. Login / Signup
2. Onboarding
3. Main Dashboard
4. Fraud Checker
5. Fraud Result
6. Book Parcel – Customer Details
7. Book Parcel – Parcel Details
8. Courier Selection
9. Booking Review
10. Booking Success
11. Bulk Upload
12. Bulk Order Validation
13. Parcel Management
14. Parcel Details
15. Parcel Tracking
16. Bulk Label Printing
17. Payments Dashboard
18. Settlement Details
19. Courier Accounts
20. Customer Database
21. Customer Details
22. Reports & Analytics
23. Subscription & Credits
24. Notifications
25. Settings

Create reusable components and a complete design system including:

* Buttons
* Inputs
* Dropdowns
* Tables
* Cards
* Status badges
* Risk badges
* Modals
* Toast notifications
* Tabs
* Pagination
* Charts
* Loading states
* Empty states
* Error states

Use realistic Bangladesh-based example data.

Currency must be displayed in:

**৳ BDT**

Phone numbers should follow Bangladesh format.

Courier names should include:

Steadfast, Pathao Courier, and RedX.

The final result should look like a real, launch-ready, premium logistics SaaS platform rather than a generic dashboard.

Focus on excellent UX, clear data hierarchy, professional spacing, reusable components, and developer-friendly design consistency.
