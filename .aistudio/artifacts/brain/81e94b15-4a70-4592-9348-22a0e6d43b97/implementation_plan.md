# ReShelf — Eco-Friendly Hyderabad Marketplace

An affordable, sustainable marketplace for Hyderabad offering second-hand books at half price, customized paper bags for local businesses, eco-friendly stationery, art supplies, handmade drawings, and home décor. Built with a warm cream, kraft paper, and forest green aesthetic inspired by Paper & Page, complete with WhatsApp order routing, UPI payment details, and an Owner Admin Dashboard.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product decisions were confirmed during clarification and will govern the build:
>
> - **Admin Access Strategy**: Owner PIN / Passcode authentication (with one-click admin lock/unlock) allowing immediate, secure access without forcing a Google login gate, while supporting Google sign-in for customer account tracking and backup.
> - **Hyderabad Delivery & Location**: Direct WhatsApp coordination. The cart formats an itemized inquiry, and the owner confirms availability, requests the specific Hyderabad locality (e.g., Gachibowli, Kukatpally, Banjara Hills, Secunderabad), and sends the UPI QR code manually.
> - **Visual Identity**: Warm paper editorial palette matching the reference image — warm cream canvas (`#FAF7F2`), natural kraft paper surfaces (`#EFE8DC`), and rich forest green typography & primary buttons (`#223D30`).

---

### 1. Overview & Core Concept

- **What It Does**: ReShelf is an eco-conscious digital storefront for Hyderabad buyers and small businesses. Users can explore curated pre-loved books at 50% discount, order branded paper bags in bulk, purchase non-toxic art supplies and seed stationery, or collect handmade Charminar & botanical artwork.
- **Order Flow ("Chat to Buy")**:
  - Individual items: Direct WhatsApp button generates `“Hi ReShelf, is [product name] available for ₹[price]?”`.
  - Multi-item Cart: Generates an itemized breakdown with product titles, quantities, unit prices, total ₹ sum, and a Hyderabad delivery inquiry.
  - Payment: The owner confirms real-time stock, collects delivery details, and sends the UPI QR code. No automated charge occurs.
- **Admin Dashboard**:
  - Secure PIN-protected panel for the store owner.
  - Add, edit, and delete products with image upload/URL, stock/available copies counter, condition rating, and pricing.
  - Manage product categories.
  - Update store contact parameters: WhatsApp Business Number, Instagram handle, and UPI QR code (image upload + UPI ID).

---

### 2. User Experience & Visual Design

#### A. Key User Flows

1. **Storefront & Discovery**:
   - Announcement banner: Hyderabad local delivery highlights + Free delivery on orders over ₹699.
   - Clean 3-zone Header: Brand wordmark ("ReShelf"), navigation category links, live search bar, wishlist counter, and Cart drawer trigger with item badge.
   - Hero Showcase: Warm bookish and craft editorial banner ("Pre-loved Books & Sustainable Goods. Thoughtfully Curated for Hyderabad.").
   - Value Pillars: "Curated with Love" · "50% Off Cover Price" · "Eco-Friendly & Upcycled" · "Hyderabad Doorstep Delivery".
   - Shop by Collection: Circular botanical icons for *Books*, *Paper Bags*, *Stationery*, *Art Supplies*, *Drawings*, and *Décor*.
   - Filterable Catalog Grid: Real-time search, category pill-free tabs, sorting (Price Low-High, High-Low, Newest), and stock availability indicators ("3 copies left", "Made to order").

2. **Product Details & WhatsApp Buying**:
   - Quick View / Detail Modal with high-res image, book condition (e.g. *Like New*, *Gently Read*), author/craftsman info, price comparison (Original MRP vs ReShelf 50% price), and stock availability.
   - Two clear actions: **Add to Cart** (with quantity stepper) and **Chat to Buy** (direct WhatsApp link).

3. **Cart Drawer & WhatsApp Order Submission**:
   - Slide-over drawer displaying line items, quantity steppers, subtotal, and eco-packaging note.
   - One-click **"Checkout via WhatsApp"** button: formats the complete order string, opens WhatsApp Web or App with pre-filled message ready to send to the owner.

4. **Admin Dashboard (Owner View)**:
   - Floating discrete Owner Entry button / `/admin` route with PIN gate.
   - **Catalog Tab**: Product table with live search, stock status badges, quick edit modal, and new product creation form (title, category, price, original MRP, copies in stock, description, image, condition).
   - **Categories Tab**: Create and reorder categories.
   - **Store Settings Tab**: Edit WhatsApp business number (e.g. +91 98765 43210), Instagram URL, store address/tagline, and upload new UPI QR image with UPI ID.

#### B. Visual Identity & Palette

- **Background Neutral (60%)**: `#FAF7F2` (Warm Book Linen) & `#FFFFFF` for product card tiles.
- **Structural Surfaces (30%)**: `#F3ECE2` (Kraft paper neutral), `#E7DDD0` hairline borders (`border-stone-200`), `#382F2D` warm charcoal text.
- **Accent & Primary CTAs (10%)**: `#233D2D` (Deep British Racing / Forest Green) with hover `#1B2F23`, and `#C27852` (Terracotta) for sale discount tags.
- **Typography Pairing**:
  - Display / Headings: `Newsreader` / `Cormorant Garamond` (classic serif, editorial literary character).
  - Body & UI: `Plus Jakarta Sans` (crisp, legibility-first modern sans).
  - Tabular Numbers: `font-mono tabular-nums` for prices, stock counters, and item totals.

---

### 3. Key Product Decisions & Trade-Offs

- **WhatsApp Coordination Over Automated Gateways**:
  - *Chosen Approach*: Direct WhatsApp message generation for both single-product ("Chat to Buy") and multi-product cart checkout.
  - *Why*: Perfectly fulfills the user's manual confirmation workflow; eliminates payment gateway transaction fees and KYC delays for Hyderabad small artisans and book reselling.
- **Dual Persistence Architecture (Firestore + Resilient Local Store)**:
  - *Chosen Approach*: Provision Firebase Firestore for persistent cloud sync of products, categories, and settings, backed by an immediate reactive cache with rich default seed data.
  - *Why*: Ensures the application works out-of-the-box in AI Studio preview while synchronizing edits across devices when cloud-connected.
- **Direct UPI QR Integration**:
  - *Chosen Approach*: The owner can upload or paste their custom UPI QR code and UPI VPA ID (e.g. `reshelf@upi`). Customers can view the UPI QR modal directly on the site or receive it via WhatsApp chat.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    ReShelf Application                      │
├──────────────────────────────┬──────────────────────────────┤
│     Customer Storefront      │       Owner Admin Panel      │
│  - Hero & Value Pillars      │  - PIN Authentication        │
│  - Filterable Product Grid   │  - Product CRUD & Stock      │
│  - Product Detail Modal      │  - Category Management       │
│  - Cart Slide-over Drawer    │  - WhatsApp & Instagram Config│
│  - UPI QR Preview Modal      │  - UPI QR Code Uploader      │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
               ▼                              ▼
    ┌──────────────────────┐      ┌──────────────────────┐
    │  Cart & Search State │      │ Store Settings State │
    └──────────┬───────────┘      └───────────┬──────────┘
               │                              │
               ▼                              ▼
    ┌────────────────────────────────────────────────────┐
    │           WhatsApp Message Formatter               │
    │  - Single item: "Hi ReShelf, is [x] available...?" │
    │  - Cart: Itemized list + quantities + total ₹      │
    └────────────────────────────────────────────────────┘
               │
               ▼
    ┌────────────────────────────────────────────────────┐
    │      Persistence: Firestore + Local Cache Sync     │
    │  - Products (Books, Bags, Stationery, Art, Décor)  │
    │  - Store Settings (WhatsApp, Instagram, UPI QR)    │
    └────────────────────────────────────────────────────┘
```

#### Core Data Entities

- **Product**: `id`, `name`, `category`, `price`, `originalPrice`, `stockCopies`, `condition`, `description`, `imageUrl`, `featured`, `tags`.
- **Category**: `id`, `name`, `slug`, `iconName`, `description`.
- **StoreSettings**: `whatsappNumber`, `instagramHandle`, `instagramUrl`, `upiId`, `upiQrUrl`, `announcementText`, `locationNote`.
- **CartItem**: `product`, `quantity`.
