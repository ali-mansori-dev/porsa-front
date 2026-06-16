# پرسا — AI Customer Support Platform

## Git Rules

**NEVER commit or create pull requests.** After every change, provide the commit message text to the user so they can commit manually.

---

## Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | TailwindCSS (RTL) |
| Animation | framer-motion (`motion/react`) |
| **Icons (primary)** | **`@untitled-ui/icons-react`** |
| Icons (fallback) | `lucide-react` — only for icons absent from Untitled UI |
| Routing | react-router-dom |
| Charts | recharts |
| Auth / Data | Real HTTP calls to `http://127.0.0.1:8000` (`src/services/api.ts`) |

---

## Design System: Untitled UI

Every button, input, and textarea in the project must use the shared components in
`src/components/ui/`. Raw `<button>` or `<input>` elements are not allowed in page code.

### Icons

**Rule:** always import from `@untitled-ui/icons-react`. Only import from `lucide-react`
when the icon is confirmed absent from Untitled UI (e.g. `Bot`, `Sparkles`, `BrainCircuit`).

Common mapping:

| lucide-react | @untitled-ui/icons-react |
|---|---|
| `X` | `XClose` |
| `Trash2` | `Trash01` |
| `Edit2` / `Pencil` | `Edit02` / `Pencil01` |
| `RefreshCw` | `RefreshCw01` |
| `GraduationCap` | `GraduationHat01` |
| `ShoppingBag` | `ShoppingBag01` |
| `MessageCircle` | `MessageCircle01` |
| `MessageSquare` | `MessageSquare01` |
| `BellRing` | `BellRinging01` |
| `BarChart3` | `BarChart03` |
| `Layers` | `LayersThree01` |
| `Menu` | `Menu01` |
| `Key` | `Key01` |
| `Copy` | `Copy01` |
| `Settings` | `Settings01` |
| `Globe2` | `Globe02` |
| `ShieldCheck` | `ShieldTick` |
| `Wrench` | `Tool01` |
| `TrendingUp` | `TrendUp01` |
| `FileText` / `FileSpreadsheet` | `File01` |
| `UserCheck` | `UserCheck01` |
| `AlertCircle` | `AlertCircle` |
| `AlertTriangle` | `AlertTriangle` |
| `BookOpen` | `BookOpen01` |
| `Award` | `Award01` |
| `ChevronLeft/Right/Up/Down` | same name |
| `Eye` / `EyeOff` | `Eye` / `EyeOff` |
| `Check` | `Check` |
| `Plus` | `Plus` |
| `Clock` | `Clock` |
| `Zap` | `Zap` |
| `HelpCircle` | `HelpCircle` |
| `Phone` | `Phone01` |
| `Search` | `SearchMd` |

Icon size convention: always pass explicit `className="w-X h-X"` — never rely on defaults.

### Button

```tsx
import { Button } from '../components/ui';

// Variants
<Button variant="primary">شروع رایگان</Button>
<Button variant="secondary">لغو</Button>
<Button variant="destructive">حذف</Button>
<Button variant="ghost">مشاهده</Button>
<Button variant="link">بیشتر بخوانید</Button>

// Sizes
<Button size="sm" />   // h-9
<Button size="md" />   // h-10  (default)
<Button size="lg" />   // h-11
<Button size="xl" />   // h-12
<Button size="2xl" />  // h-14

// Icons
<Button leftIcon={<ArrowLeft className="w-5 h-5" />}>بازگشت</Button>
<Button rightIcon={<ArrowRight className="w-5 h-5" />}>بعدی</Button>

// States
<Button loading>در حال ارسال...</Button>
<Button disabled>غیرفعال</Button>

// Full width
<Button fullWidth>ثبت‌نام</Button>
```

### Input

```tsx
import { Input } from '../components/ui';

<Input
  label="شماره همراه"
  placeholder="09123456789"
  hint="بدون صفر اول وارد نکنید"
  error="شماره اشتباه است"
  leftIcon={<Phone01 className="w-4 h-4" />}
/>

// Password with toggle handled externally
<Input
  type={show ? 'text' : 'password'}
  rightIcon={<Eye className="w-4 h-4" onClick={toggleShow} />}
/>
```

### Textarea

```tsx
import { Textarea } from '../components/ui';

<Textarea
  label="توضیحات"
  rows={4}
  placeholder="متن خود را بنویسید..."
  error="این فیلد الزامی است"
/>
```

---

## RTL

- All page roots use `dir="rtl"`
- Persian numbers in user-facing copy (۱، ۲، ۳...)
- `text-right` is the default text alignment
- Flex rows are mirrored (`flex-row-reverse` not needed — RTL handles it)

## File conventions

- `src/pages/` — page-level components (routes)
- `src/pages/dashboard/` — authenticated dashboard pages
- `src/components/ui/` — shared design system (Button, Input, Textarea…)
- `src/components/layout/` — shell layouts (DashboardLayout, Sidebar…)
- `src/components/common/` — utility UI (BottomDrawer, TokenBar…)
- `src/services/api.ts` — mock API (localStorage-backed, no real backend)
- `src/types.ts` — shared TypeScript types

## Backend

Real FastAPI backend runs at `http://127.0.0.1:8000`. `src/services/api.ts` makes
real HTTP calls using Bearer token auth (`Authorization: Bearer <token>`, stored as
`localStorage.access_token`).

**Endpoints without a user-facing API equivalent** (kept as local stubs):
- `api.tokens` — no token usage endpoint; serves mock data
- `api.business.regenerateKey` — admin-only in backend; returns current key unchanged
- `api.business.deactivate` — admin-only; just clears local token

**Escalations as Conversations:** The user-facing conversations view is powered by
`GET /me/escalations`. Full message threads are not available in the user API.

SMS notification: when a user asks a question with no configured answer, the
platform sends an SMS to the business owner. This is a key differentiator —
always mention it in onboarding and landing copy.
