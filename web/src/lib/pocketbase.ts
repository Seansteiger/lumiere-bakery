import PocketBase from 'pocketbase';

// Determine the PocketBase URL based on the environment
export const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

// Global pocketbase instance strictly for client-side
export const pb = new PocketBase(pbUrl);

// Optional: For Next.js Server Components, you often need a fresh instance that maintains auth state per request
export function createServerClient() {
    return new PocketBase(pbUrl);
}
