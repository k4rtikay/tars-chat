# tars chat

A real-time chat application built with Next.js, Convex, and Clerk.

## Features

- **Real-time messaging** — Messages appear instantly via Convex's reactive queries
- **Typing indicators** — See when someone is typing with a throttled, staleness-aware system
- **Online status** — Heartbeat-based presence detection with green dot indicators
- **Unread badges** — Per-conversation unread counts with read tracking
- **User search** — Find and start conversations with any registered user
- **Mobile responsive** — Full-width sidebar/chat toggle on smaller screens

## Tech Stack

- **Frontend** — Next.js 15 (App Router), React, Tailwind CSS, shadcn/ui
- **Backend** — Convex (database, real-time queries, mutations)
- **Auth** — Clerk (sign-in, user management, JWT tokens)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Convex](https://convex.dev) account
- A [Clerk](https://clerk.com) account

### Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/k4rtikay/tars-chat.git
cd tars-chat
pnpm install
```

2. Create a `.env.local` file with your keys:

```
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

3. Start the Convex dev server and Next.js:

```bash
pnpm exec convex dev
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting.

## Project Structure

```
convex/              — Backend functions and schema
  schema.ts          — Database tables (users, conversations, messages, typingIndicators)
  users.ts           — User storage and online status
  conversations.ts   — Conversation CRUD, listing, and read tracking
  messages.ts        — Message sending and listing
  typing.ts          — Typing indicator mutations and queries

src/
  app/               — Next.js app router pages
  components/
    website/         — Chat UI components (sidebar, chat view, message list, etc.)
    ui/              — shadcn/ui primitives
  hooks/             — Custom hooks (useStoreUserEffect)
  lib/               — Utilities (time formatting, online status)
```
