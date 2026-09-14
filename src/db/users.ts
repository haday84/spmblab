import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  try {
    const lower = email.toLowerCase();
    const isAdmin = 
      lower === 'hadygruty2@gmail.com' ||
      lower.includes('admin') ||
      lower.endsWith('@smpn2telukbayur.sch.id');

    const assignedRole = isAdmin ? 'admin' : 'user';

    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        role: assignedRole,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          role: isAdmin ? 'admin' : 'user',
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Database user upsert failed:", error);
    throw new Error("Database user synchronization failed.", { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const found = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return found[0] || null;
  } catch (error) {
    console.error("Database fetch user failed:", error);
    throw new Error("Database query failed.", { cause: error });
  }
}
