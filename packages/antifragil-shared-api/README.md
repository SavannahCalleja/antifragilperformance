# @antifragil/shared-api

Shared **Supabase table names**, **`.select()` column lists**, and **query helpers** for `profiles` and `exercises`. Use this in the React Native app and on the Vercel web app so both stay aligned with the same database contract.

## When you change the database

1. Add or rename columns on `profiles` / `exercises` in Supabase.
2. Update **`src/schema.ts`** (`PROFILE_SELECT`, `EXERCISE_SELECT`) and **`src/types.ts`**.
3. Release / reinstall this package in the web repo (see below). No need to duplicate `.select('...')` strings in the website.

## Use in the Vercel / Next.js app

**Option A — same monorepo:** add the workspace package as a dependency (as the mobile app does).

**Option B — separate repo:** copy the `packages/antifragil-shared-api` folder into your web monorepo, or install via git:

```json
"@antifragil/shared-api": "file:../AntifragilApp/packages/antifragil-shared-api"
```

Adjust the path to wherever this package lives relative to the web project.

**Next.js:** add the package to `transpilePackages` in `next.config.js`:

```js
transpilePackages: ['@antifragil/shared-api'],
```

Then:

```ts
import { createClient } from '@supabase/supabase-js';
import { fetchProfile, fetchExercises, PROFILE_SELECT } from '@antifragil/shared-api';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const { data } = await fetchExercises(supabase);
```

Use the same env names as production (`NEXT_PUBLIC_SUPABASE_*`) so both apps hit one project.
