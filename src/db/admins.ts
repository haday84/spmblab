import { db } from './index.ts';
import { adminAccounts, users } from './schema.ts';
import { eq, sql, desc } from 'drizzle-orm';

export async function getAllAdminAccounts() {
  try {
    return await db.select({
      id: adminAccounts.id,
      name: adminAccounts.name,
      email: adminAccounts.email,
      role: adminAccounts.role,
      roleLabel: adminAccounts.roleLabel,
      assignedJalur: adminAccounts.assignedJalur,
      active: adminAccounts.active,
      lastLogin: adminAccounts.lastLogin,
      createdAt: adminAccounts.createdAt,
    }).from(adminAccounts).orderBy(desc(adminAccounts.createdAt));
  } catch (error) {
    console.error("Database query failed in getAllAdminAccounts:", error);
    throw new Error("Failed to retrieve admin accounts.", { cause: error });
  }
}

export async function getAdminByEmail(email: string) {
  try {
    const res = await db.select()
      .from(adminAccounts)
      .where(eq(adminAccounts.email, email.trim().toLowerCase()))
      .limit(1);
    return res[0] || null;
  } catch (error) {
    console.error("Database query failed in getAdminByEmail:", error);
    throw new Error("Failed to find admin by email.", { cause: error });
  }
}

export async function authenticateAdmin(email: string, password: string) {
  try {
    const admin = await getAdminByEmail(email);
    if (!admin) return null;
    if (admin.active !== 1) return null;
    if (admin.password !== password) return null;

    // Update lastLogin
    await db.update(adminAccounts)
      .set({ lastLogin: new Date() })
      .where(eq(adminAccounts.id, admin.id));

    return {
      id: String(admin.id),
      name: admin.name,
      email: admin.email,
      role: admin.role,
      roleLabel: admin.roleLabel,
      assignedJalur: admin.assignedJalur,
      active: admin.active === 1,
      lastLogin: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Admin authentication error:", error);
    throw new Error("Authentication failed.", { cause: error });
  }
}

export async function insertAdminAccount(data: {
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  password: string;
  assignedJalur?: string;
}) {
  try {
    const res = await db.insert(adminAccounts)
      .values({
        name: data.name,
        email: data.email.trim().toLowerCase(),
        role: data.role,
        roleLabel: data.roleLabel,
        password: data.password,
        assignedJalur: data.assignedJalur || 'semua',
        active: 1,
      })
      .returning();
    return res[0];
  } catch (error) {
    console.error("Failed to insert admin account:", error);
    throw new Error("Failed to create admin account.", { cause: error });
  }
}

export async function updateAdminAccountById(
  id: number,
  data: Partial<{
    name: string;
    email: string;
    role: string;
    roleLabel: string;
    password?: string;
    assignedJalur?: string;
    active?: number;
  }>
) {
  try {
    const res = await db.update(adminAccounts)
      .set(data)
      .where(eq(adminAccounts.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error("Failed to update admin account:", error);
    throw new Error("Failed to update admin account.", { cause: error });
  }
}

export async function deleteAdminAccountById(id: number) {
  try {
    const res = await db.delete(adminAccounts)
      .where(eq(adminAccounts.id, id))
      .returning();
    return res[0] || null;
  } catch (error) {
    console.error("Failed to delete admin account:", error);
    throw new Error("Failed to delete admin account.", { cause: error });
  }
}

export async function seedInitialAdminsIfEmpty(initialList: any[]) {
  try {
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(adminAccounts);
    const count = Number(countResult[0]?.count || 0);

    if (count === 0 && initialList.length > 0) {
      console.log(`Seeding ${initialList.length} initial admin accounts into Cloud SQL...`);
      for (const item of initialList) {
        await db.insert(adminAccounts).values({
          name: item.name,
          email: item.email.toLowerCase(),
          role: item.role,
          roleLabel: item.roleLabel,
          password: item.password || 'admin123',
          assignedJalur: item.assignedJalur || 'semua',
          active: item.active ? 1 : 0,
        }).onConflictDoNothing();
      }
      console.log('Admin accounts seeded successfully.');
    }
  } catch (error) {
    console.error("Seeding admin accounts failed:", error);
  }
}
