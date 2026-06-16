# Porsa API — Frontend Integration Reference

Base URL: `http://127.0.0.1:8000`  
Interactive docs: `http://127.0.0.1:8000/docs`

## Authentication

All protected endpoints require:
```
Authorization: Bearer <token>
Content-Type: application/json
```

The token is returned from `POST /auth/verify-otp` and stored in `localStorage.access_token`.

---

## Auth Endpoints

### POST /auth/request-otp
Send a one-time password to the phone number.

**Request body**
```json
{ "phone": "09123456789" }
```

**Response 200**
```json
{
  "detail": "کد تایید ارسال شد",
  "expires_in": 120,
  "dev_code": "123456"   // only in development mode
}
```

**Frontend call:** `api.auth.sendOtp(phone)`

---

### POST /auth/verify-otp
Verify the OTP and receive a Bearer token.

**Request body**
```json
{ "phone": "09123456789", "code": "123456" }
```

**Response 200**
```json
{
  "token": "eyJ...",
  "token_type": "bearer",
  "business_id": "uuid-or-null",
  "business_name": "نام کسب‌وکار یا null"
}
```

- If `business_id` is `null` → user has no business → redirect to `/onboarding`
- If `business_id` is set → user has a business → redirect to `/dashboard`

**Frontend call:** `api.auth.verifyOtp(phone, code)` → stores token, returns `{ token, existing }`

---

### GET /auth/me
Get the current logged-in user's profile.

**Headers:** Bearer required

**Response 200**
```json
{
  "id": "user-uuid",
  "phone": "09123456789",
  "business": {
    "id": "business-uuid",
    "name": "آکادمی اپکس",
    "type": "education"
  }
}
```

**Frontend call:** `api.auth.getMe()`

---

### POST /auth/logout
Invalidate the current session token.

**Headers:** Bearer required

**Response 204** (no body)

**Frontend call:** `api.auth.logout()`

---

## Business Endpoints (Owner)

### POST /me/business
Create the business during onboarding. Can only be called once per user.

**Headers:** Bearer required

**Request body**
```json
{
  "name": "آکادمی اپکس",
  "type": "education",
  "field": "آموزش زبان انگلیسی",
  "contact": "+989123456789",
  "working_hours": "شنبه تا پنجشنبه ۹ تا ۱۸",
  "welcome_message": "سلام! چطور می‌توانم کمک کنم؟",
  "response_style": "friendly"
}
```

**Type values:** `education` | `shop` | `service`  
**Response style values:** `friendly` | `formal` | `brief`

> Note: Frontend uses `retail`/`services` for type, and `technical` for style — the API adapter converts these automatically.

**Response 201** → same shape as GET /me/business

**Frontend call:** `api.business.create(data)`

---

### GET /me/business
Get the current owner's business including knowledge details and FAQ.

**Headers:** Bearer required

**Response 200**
```json
{
  "id": "business-uuid",
  "name": "آکادمی اپکس",
  "type": "education",
  "field": "آموزش زبان انگلیسی",
  "contact": "+989123456789",
  "working_hours": "شنبه تا پنجشنبه ۹ تا ۱۸",
  "welcome_message": "سلام! چطور می‌توانم کمک کنم؟",
  "response_style": "friendly",
  "details": {
    "courses_offered": "دوره آیلتس، تافل، انگلیسی عمومی",
    "tuition_fees": "۲,۵۰۰,۰۰۰ تومان هر ترم"
  },
  "faq": [
    { "id": "faq-uuid", "question": "مدرک اعطا می‌شود؟", "answer": "بله" }
  ],
  "api_key": "pk_live_..."
}
```

**Frontend call:** `api.business.getMe()` / `api.details.getAll()`

---

### PATCH /me/business
Partially update the business. Only send fields you want to change.

**Headers:** Bearer required

**Request body** (all fields optional)
```json
{
  "name": "نام جدید",
  "field": "حوزه جدید",
  "contact": "شماره جدید",
  "working_hours": "ساعات جدید",
  "welcome_message": "پیام خوشامد جدید",
  "response_style": "formal",
  "details": {
    "new_key": "مقدار",
    "existing_key": "مقدار به‌روزشده"
  }
}
```

> Sending `"details"` **replaces the entire details dict** — always send the full dict.

**Response 200** → same shape as GET /me/business

**Frontend calls:**
- `api.business.update(id, updates)` — updates business fields
- `api.details.saveAll(items)` — replaces all details
- `api.details.add(item)` — adds one detail (fetch + merge + patch)
- `api.details.update(key, value)` — updates one detail value
- `api.details.delete(key)` — removes one detail key

---

## FAQ Endpoints

### GET /me/business/faq
List all FAQ entries for the current business.

**Headers:** Bearer required

**Response 200**
```json
[
  { "id": "faq-uuid-1", "question": "سوال ۱", "answer": "پاسخ ۱" },
  { "id": "faq-uuid-2", "question": "سوال ۲", "answer": "پاسخ ۲" }
]
```

**Frontend call:** `api.qas.getAll()`

---

### POST /me/business/faq
Add a single FAQ entry.

**Headers:** Bearer required

**Request body**
```json
{ "question": "سوال جدید", "answer": "پاسخ جدید" }
```

**Response 201**
```json
{ "id": "new-faq-uuid", "question": "سوال جدید", "answer": "پاسخ جدید" }
```

**Frontend call:** `api.qas.add({ question, answer })`

---

### PUT /me/business/faq
Replace the entire FAQ list.

**Headers:** Bearer required

**Request body**
```json
[
  { "question": "سوال ۱", "answer": "پاسخ ۱" },
  { "question": "سوال ۲", "answer": "پاسخ ۲ ویرایش‌شده" }
]
```

> Used internally by `api.qas.update()` — fetch all → update in memory → PUT back.

**Response 200** → updated list with new IDs

---

### DELETE /me/business/faq/{entry_id}
Delete a single FAQ entry.

**Headers:** Bearer required

**Response 204** (no body)

**Frontend call:** `api.qas.delete(id)`

---

## Escalations Endpoints

Escalations are questions from customers that the AI could not answer. The dashboard's **Conversations** view is powered by this endpoint.

### GET /me/escalations
List all escalated questions for the current business.

**Headers:** Bearer required

**Query params** (optional)
- `status`: `pending` | `answered` | `closed`
- `page`: integer (default 1)
- `page_size`: integer (default 20)

**Response 200**
```json
{
  "items": [
    {
      "id": "escalation-uuid",
      "business_id": "business-uuid",
      "question": "سوال مشتری",
      "status": "pending",
      "asked_at": "2026-06-17T10:30:00Z",
      "answer": null,
      "answered_at": null
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}
```

**Status mapping (frontend):**
- `pending` → `escalated`
- `answered` → `resolved`
- `closed` → `resolved`

**Frontend call:** `api.conversations.getAll()`

---

### POST /me/escalations/{id}/answer
Answer an escalated question. Changes status to `answered`.

**Headers:** Bearer required

**Request body**
```json
{ "answer": "متن پاسخ شما" }
```

**Response 200** → updated escalation object

**Frontend call:** `api.conversations.addMessage(conversationId, answer)`

---

## Customer Chat Endpoint

Used directly by the chat widget embedded on the business's website. **Not called from the dashboard.**

### POST /chat/
Send a customer message to the AI assistant.

**Rate limit:** 20 requests/minute per session

**Request body**
```json
{
  "message": "سلام، ساعت کاری شما چیه؟",
  "session_id": "uuid-generated-client-side",
  "business_id": "business-uuid"
}
```

**Response 200**
```json
{
  "reply": "سلام! ساعت کاری ما شنبه تا پنجشنبه ۹ تا ۱۸ است.",
  "session_id": "same-uuid",
  "escalated": false
}
```

- If `escalated: true` → the AI couldn't answer and the business owner was notified via SMS.

---

## Type Mapping Reference

### Business type
| Frontend | Backend |
|---|---|
| `education` | `education` |
| `retail` | `shop` |
| `services` | `service` |

### Response style
| Frontend | Backend |
|---|---|
| `friendly` | `friendly` |
| `formal` | `formal` |
| `technical` | `brief` |

### Business field mapping (camelCase ↔ snake_case)
| Frontend | Backend |
|---|---|
| `workingHours` | `working_hours` |
| `welcomeMessage` | `welcome_message` |
| `responseStyle` | `response_style` |
| `apiKey` | `api_key` |

---

## Error Format

All errors follow FastAPI's default format:
```json
{ "detail": "پیام خطا به فارسی یا انگلیسی" }
```

Common HTTP status codes:
- `400` — Invalid request body
- `401` — Missing or invalid Bearer token
- `404` — Resource not found
- `409` — Conflict (e.g. business already exists)
- `422` — Validation error
- `429` — Rate limit exceeded

---

## Not Available in User-Facing API

These frontend features have no user-facing endpoint and use local fallbacks:

| Feature | Fallback |
|---|---|
| Token usage stats | Stored in `localStorage.db_tokens` |
| Regenerate API key | Returns existing key unchanged |
| Deactivate account | Clears local access token only |
| Full conversation history | Only escalations available |
