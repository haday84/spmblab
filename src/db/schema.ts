import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  text, 
  integer, 
  doublePrecision, 
  timestamp, 
  jsonb 
} from 'drizzle-orm/pg-core';

// Users table for Firebase Authentication synchronization
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('user').notNull(), // 'admin' | 'user'
  createdAt: timestamp('created_at').defaultNow(),
});

// Admin and Committee Accounts for SPMB verification & management
export const adminAccounts = pgTable('admin_accounts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull().default('verifikator'), // 'superadmin' | 'admin' | 'verifikator'
  roleLabel: text('role_label').notNull().default('Panitia Verifikator'),
  password: text('password').notNull(),
  assignedJalur: text('assigned_jalur').default('semua'), // 'zonasi' | 'prestasi' | 'afirmasi' | 'mutasi' | 'semua'
  active: integer('active').default(1),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Candidates table for SPMB SMP Negeri 2 Teluk Bayur
export const candidates = pgTable('candidates', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  registrationNumber: text('registration_number').notNull().unique(),
  fullName: text('full_name').notNull(),
  gender: text('gender').notNull(),
  nisn: text('nisn').notNull(),
  nik: text('nik').notNull(),
  birthPlace: text('birth_place').notNull(),
  birthDate: text('birth_date').notNull(),
  address: text('address').notNull(),
  rt: text('rt').default(''),
  rw: text('rw').default(''),
  kelurahan: text('kelurahan').default(''),
  kecamatan: text('kecamatan').default(''),
  distanceToSchoolKm: doublePrecision('distance_to_school_km').notNull(),
  jalur: text('jalur').notNull(), // 'zonasi' | 'prestasi' | 'afirmasi' | 'mutasi'
  previousSchool: text('previous_school').notNull(),
  parentName: text('parent_name').notNull(),
  parentPhone: text('parent_phone').notNull(),
  parentJob: text('parent_job'),
  averageScore: doublePrecision('average_score').notNull(),
  achievementName: text('achievement_name'),
  achievementLevel: text('achievement_level'),
  kipOrPkhNumber: text('kip_or_pkh_number'),
  documents: jsonb('documents'),
  verificationStatus: text('verification_status').notNull().default('menunggu'), // 'menunggu' | 'terverifikasi' | 'perlu_perbaikan' | 'ditolak'
  verificationNotes: text('verification_notes'),
  verifiedBy: text('verified_by'),
  verifiedAt: timestamp('verified_at'),
  selectionResult: text('selection_result').notNull().default('pending'), // 'pending' | 'diterima' | 'cadangan' | 'tidak_diterima'
  selectionRank: integer('selection_rank'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  candidates: many(candidates),
}));

export const candidatesRelations = relations(candidates, ({ one }) => ({
  user: one(users, {
    fields: [candidates.userId],
    references: [users.id],
  }),
}));
