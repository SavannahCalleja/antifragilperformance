# Antifragil monorepo

This repository contains:

- **`apps/mobile`** — React Native app (iOS / Android). Run all RN commands from this package via root scripts or `npm run -w @antifragil/mobile <script>`.
- **`apps/web`** — Next.js site (Vercel). No imports from the mobile app; shared code is limited to **`@antifragil/shared-api`** (Supabase helpers + DB-oriented types/constants) and **`@supabase/supabase-js`**.
- **`packages/antifragil-shared-api`** — Shared Supabase query helpers and schema-related types.

## Prerequisites

- Node.js **>= 22.11.0**
- For mobile: Xcode, Android SDK, CocoaPods, and the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment).

## Install

From the repository root:

```sh
npm install
```

Environment variables for **both** apps can live in a **root** `.env` file (mobile reads it via `react-native-dotenv`). The web app uses **`NEXT_PUBLIC_*`** variables (see `apps/web/lib/supabase.ts`).

## Mobile (React Native)

```sh
npm run mobile:start
```

In another terminal:

```sh
npm run mobile:ios
# or
npm run mobile:android
```

First-time iOS native deps (from `apps/mobile/ios`):

```sh
cd apps/mobile/ios && bundle install && bundle exec pod install
```

Regenerate embedded privacy HTML after editing `apps/mobile/legal/privacy-policy.html`:

```sh
npm run mobile:embed-privacy
```

## Web (Next.js)

```sh
npm run web:dev
```

Open [http://localhost:3000](http://localhost:3000). Production build:

```sh
npm run web:build
```

Regenerate PWA icons after changing the source SVG:

```sh
npm run web:icons
```

## Shared package

```sh
npm run shared:typecheck
```

## Typechecking

```sh
npm run typecheck
```

This runs TypeScript checks for mobile, web, and `antifragil-shared-api` separately.
