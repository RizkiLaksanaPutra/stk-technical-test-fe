# Menu Tree System FE

## 🚀 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: Typescript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Native `fetch`

## 📦 Dependencies

### Production Dependencies

- **zustand** (^5.0.8): Auto-generated type-safe database client.

- **react-dnd** (^4.1.12): Object schema validation library.

### Development Dependencies

- **prettier-plugin-tailwindcss** (^0.7.1): Auto sort tailwind class.

## 🛠️ Installation

### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/RizkiLaksanaPutra/stk-technical-test-fe.git
   cd menu-tree-system-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   ```

## 🧑‍💻 How to Run in Development Mode

Run with hot reload:
```bash
npm run dev
```

## 🧑‍💻 How to Run in Development Mode

Build the Project:
```bash
npm run dev
```

Start the Production Server:
```bash
npm run start
```

## 📚 API Documentation

*https://documenter.getpostman.com/view/44430374/2sB3WmUi9A*

## 🏗️ Project Structure

```
menu-tree-system-fe/
├── app/
│   ├── globals.css            # Global styles (Tailwind)
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main page (Menu Tree)
│   └── Sidebar.tsx            # Sidebar navigation component
│
├── components/
│   └── Sidebar.tsx            # Sidebar menu (responsive)
│
├── lib/
│   └── api/
│       └── MenuApi.js         # API service for CRUD menu operations
│
├── store/
│   └── menuStore.ts           # Zustand store for menu state
│
├── public/                    # Static assets
│
├── .env.example               # Example environment configuration
├── next.config.ts             # Next.js configuration
├── tailwind.config.js         # TailwindCSS configuration
├── tsconfig.json              # TypeScript configuration
├── postcss.config.mjs         # PostCSS configuration
└── README.md

```
