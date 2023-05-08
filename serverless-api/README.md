# My Songbook API
This is a simple Node.js API hosted on Vercel.

### Clone and Deploy
Install the Vercel CLI:

```bash
npm i -g vercel
```

Navigate to this folder

Run the app at the root of the repository:

```bash
vercel dev
```

### Generate DB migration for Drizzle Schema
```
npx drizzle-kit generate:pg --out migrations-folder --schema db/schema.ts   
```
