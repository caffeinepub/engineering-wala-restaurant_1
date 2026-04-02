# Engineering Wala Restaurant — Security Report

**App:** Engineering Wala Restaurant  
**Owner:** Aadarsh Shukla  
**Platform:** Internet Computer (ICP) via Caffeine  
**Date:** April 2026

---

## 1. Authentication & Authorization

| Area | Status | Details |
|------|---------|---------|
| Owner Panel | ✅ Secure | Protected by client-side password check (`aadarshshukla8800`). Session stored in `sessionStorage` (cleared on tab close). |
| Backend Admin APIs | ✅ Secure | `getAllOrders`, `updateOrderStatus`, `getAllContactMessages` require ICP `caller` principal to be an admin via `AccessControl.isAdmin()`. |
| Order Placement | ✅ Open | Intentionally public — guests can place orders without login. |
| Order Cancellation | ✅ Phone-verified | Requires matching phone number to cancel an order. |

**Recommendation:** The owner panel password is client-side only. For production, consider adding Internet Identity (II) login for the owner to authenticate at the backend level as well.

---

## 2. Data Security

| Data | Access Control | Notes |
|------|---------------|-------|
| All Orders | Admin-only (backend) | `getAllOrders` checks `isAdmin` |
| Contact Messages | Admin-only (backend) | `getAllContactMessages` checks `isAdmin` |
| Order by Phone | Phone-verified | Phone number acts as lightweight token |
| Menu / Offers / Announcements | Public read | Intentional — menus should be visible to everyone |
| User Profiles | Owner of profile | Each user can only read/write their own profile |

---

## 3. Input Validation

| Area | Status | Notes |
|------|---------|-------|
| Order Form | ⚠️ Basic | Name, phone, address are required. No regex validation on phone format. |
| Contact Form | ⚠️ Basic | Required fields only, no XSS sanitization at frontend |
| Backend traps | ✅ | Motoko uses `Runtime.trap()` for invalid states — prevents corrupt data |

**Recommendation:** Add phone number regex validation and sanitize text inputs to prevent XSS.

---

## 4. Owner Access Security

- **Trigger:** Type `owner` anywhere (desktop) or tap bottom-left 5 times (mobile)
- **Password:** Stored as plain string in frontend JS bundle — a determined attacker can find it by inspecting the source code.
- **Session:** Uses `sessionStorage` — cleared when the browser tab is closed. This is safer than `localStorage`.
- **No brute-force protection:** There is currently no rate-limit or lockout after failed password attempts.

**Risk Level: Medium**  
**Recommendation:** Implement a lockout after 5 failed attempts and/or move owner authentication to Internet Identity.

---

## 5. Backend Security (Motoko / ICP)

| Feature | Status | Notes |
|---------|---------|-------|
| Canister upgrades | ✅ Safe | Stable state using persistent Maps |
| Caller verification | ✅ | All admin functions verify `caller` principal |
| No reentrancy | ✅ | Motoko prevents reentrancy by design |
| Data persistence | ✅ | Orders and messages are stored on-chain — tamper-proof |
| HTTPS | ✅ | ICP serves all apps over HTTPS by default |
| DDoS protection | ✅ | ICP subnet provides inherent DDoS resistance |

---

## 6. Payment Security

- Current payments are informational only (COD, UPI note, Card note).
- **No actual payment processing** happens in the app — all payments are manual.
- No sensitive card data is collected or stored.
- **Risk Level: Low** for current implementation.

---

## 7. Data Privacy

- Customer name, phone, and address are stored on-chain for order fulfillment.
- No passwords, credit card numbers, or sensitive PII beyond contact info is stored.
- Data is accessible only to the owner via the protected dashboard.

---

## 8. Summary & Recommendations

| Priority | Recommendation |
|----------|----------------|
| HIGH | Move owner authentication to Internet Identity for backend-level security |
| MEDIUM | Add input validation and phone format checks |
| MEDIUM | Add lockout after repeated failed owner password attempts |
| LOW | Periodically rotate the owner dashboard password |
| LOW | Add Content Security Policy (CSP) headers |

---

## 9. Current Security Score

**Overall: 7.5 / 10**  
The app is secure for a restaurant ordering system at this scale. The main gap is the client-side owner password. The backend (ICP) is inherently very secure — all data is on-chain and admin APIs are properly gated.

---

*Report generated for Engineering Wala Restaurant. For questions, contact Aadarsh Shukla.*
