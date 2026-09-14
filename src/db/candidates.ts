import { db } from './index.ts';
import { candidates, users } from './schema.ts';
import { eq, or, desc, sql } from 'drizzle-orm';

export async function getAllCandidates() {
  try {
    return await db.select().from(candidates).orderBy(desc(candidates.createdAt));
  } catch (error) {
    console.error("Database query failed in getAllCandidates:", error);
    throw new Error("Failed to retrieve candidate list.", { cause: error });
  }
}

export async function getCandidateByRegOrNisn(identifier: string) {
  try {
    const trimmed = identifier.trim().toUpperCase();
    const result = await db.select().from(candidates).where(
      or(
        eq(candidates.registrationNumber, trimmed),
        eq(candidates.nisn, identifier.trim())
      )
    ).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Database query failed in getCandidateByRegOrNisn:", error);
    throw new Error("Failed to find candidate.", { cause: error });
  }
}

export async function insertCandidate(data: typeof candidates.$inferInsert) {
  try {
    const result = await db.insert(candidates).values(data).returning();
    return result[0];
  } catch (error) {
    console.error("Database insert failed in insertCandidate:", error);
    throw new Error("Failed to register candidate.", { cause: error });
  }
}

export async function updateCandidateVerification(
  id: number,
  status: string,
  notes?: string,
  verifiedBy?: string,
  documents?: any
) {
  try {
    const updateData: Partial<typeof candidates.$inferInsert> = {
      verificationStatus: status,
      verificationNotes: notes || null,
      verifiedBy: verifiedBy || null,
      verifiedAt: new Date(),
      updatedAt: new Date(),
    };
    if (documents) {
      updateData.documents = documents;
    }

    const result = await db.update(candidates)
      .set(updateData)
      .where(eq(candidates.id, id))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error("Database update failed in updateCandidateVerification:", error);
    throw new Error("Failed to update candidate verification status.", { cause: error });
  }
}

export async function updateCandidateSelection(
  id: number,
  result: string,
  rank?: number
) {
  try {
    const res = await db.update(candidates)
      .set({
        selectionResult: result,
        selectionRank: rank || null,
        updatedAt: new Date(),
      })
      .where(eq(candidates.id, id))
      .returning();

    return res[0] || null;
  } catch (error) {
    console.error("Database update failed in updateCandidateSelection:", error);
    throw new Error("Failed to update selection result.", { cause: error });
  }
}

export async function seedInitialCandidatesIfEmpty(initialList: any[]) {
  try {
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(candidates);
    const count = Number(countResult[0]?.count || 0);

    if (count === 0 && initialList.length > 0) {
      console.log(`Seeding ${initialList.length} initial candidates into Cloud SQL...`);
      for (const item of initialList) {
        await db.insert(candidates).values({
          registrationNumber: item.registrationNumber,
          fullName: item.fullName,
          gender: item.gender,
          nisn: item.nisn,
          nik: item.nik,
          birthPlace: item.birthPlace,
          birthDate: item.birthDate,
          address: item.address,
          rt: item.rt || '',
          rw: item.rw || '',
          kelurahan: item.kelurahan || '',
          kecamatan: item.kecamatan || '',
          distanceToSchoolKm: Number(item.distanceToSchoolKm) || 1.0,
          jalur: item.jalur,
          previousSchool: item.previousSchool,
          parentName: item.parentName,
          parentPhone: item.parentPhone,
          parentJob: item.parentJob || '',
          averageScore: Number(item.averageScore) || 80,
          achievementName: item.achievementName || null,
          achievementLevel: item.achievementLevel || null,
          kipOrPkhNumber: item.kipOrPkhNumber || null,
          documents: item.documents || {},
          verificationStatus: item.verificationStatus || 'menunggu',
          verificationNotes: item.verificationNotes || null,
          verifiedBy: item.verifiedBy || null,
          selectionResult: item.selectionResult || 'pending',
          selectionRank: item.selectionRank || null,
        });
      }
      console.log('Seeding completed successfully.');
    }
  } catch (error) {
    console.error("Seeding candidates failed:", error);
  }
}
