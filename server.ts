import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  getAllCandidates, 
  getCandidateByRegOrNisn, 
  insertCandidate, 
  updateCandidateVerification, 
  updateCandidateSelection,
  seedInitialCandidatesIfEmpty 
} from './src/db/candidates.ts';
import { 
  getAllAdminAccounts, 
  authenticateAdmin, 
  insertAdminAccount, 
  updateAdminAccountById, 
  deleteAdminAccountById, 
  seedInitialAdminsIfEmpty 
} from './src/db/admins.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { INITIAL_CANDIDATES, QUOTA_LIST, INITIAL_ADMINS } from './src/data/initialData.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'cloud_sql_postgresql', service: 'spmb_smpn2_telukbayur' });
});

// Sync Firebase Authenticated User to Cloud SQL
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const user = await getOrCreateUser(
      req.user.uid,
      req.user.email || '',
      req.user.name || undefined
    );
    res.json({ success: true, user });
  } catch (error: any) {
    console.error('Error syncing user to Cloud SQL:', error);
    res.status(500).json({ error: error.message || 'Database user sync error' });
  }
});

// Get All Candidates (with initial seed if empty)
app.get('/api/candidates', async (req, res) => {
  try {
    // Ensure initial seed candidates exist on first query
    await seedInitialCandidatesIfEmpty(INITIAL_CANDIDATES);
    const list = await getAllCandidates();
    res.json(list);
  } catch (error: any) {
    console.error('Error in GET /api/candidates:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch candidates' });
  }
});

// Get Single Candidate by Registration Number or NISN
app.get('/api/candidates/search', async (req, res) => {
  const query = req.query.q as string;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }
  try {
    const candidate = await getCandidateByRegOrNisn(query);
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(candidate);
  } catch (error: any) {
    console.error('Error in GET /api/candidates/search:', error);
    res.status(500).json({ error: error.message || 'Search failed' });
  }
});

// Register New Candidate
app.post('/api/candidates', async (req, res) => {
  try {
    const data = req.body;
    if (!data.fullName || !data.nisn || !data.nik || !data.jalur) {
      return res.status(400).json({ error: 'Missing required candidate registration fields' });
    }

    const created = await insertCandidate(data);
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Error in POST /api/candidates:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// Verify Candidate Documents (Committee / Admin action)
app.post('/api/candidates/:id/verify', async (req, res) => {
  const id = Number(req.params.id);
  const { status, notes, verifiedBy, documents } = req.body;
  if (!id || !status) {
    return res.status(400).json({ error: 'ID and verification status are required' });
  }

  try {
    const updated = await updateCandidateVerification(id, status, notes, verifiedBy, documents);
    if (!updated) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json(updated);
  } catch (error: any) {
    console.error('Error in POST /api/candidates/:id/verify:', error);
    res.status(500).json({ error: error.message || 'Verification update failed' });
  }
});

// Auto-Calculate and Rank Selection based on School Quota
app.post('/api/candidates/calculate-selection', async (req, res) => {
  try {
    const all = await getAllCandidates();
    let updatedCount = 0;

    const jalurs = ['zonasi', 'prestasi', 'afirmasi', 'mutasi'] as const;

    for (const jalur of jalurs) {
      const quota = QUOTA_LIST.find(q => q.jalur === jalur)?.quotaSeats || 20;

      // Filter only verified candidates
      const list = all.filter(c => c.jalur === jalur && c.verificationStatus === 'terverifikasi');

      if (jalur === 'zonasi') {
        list.sort((a, b) => (Number(a.distanceToSchoolKm) || 0) - (Number(b.distanceToSchoolKm) || 0));
      } else {
        list.sort((a, b) => (Number(b.averageScore) || 0) - (Number(a.averageScore) || 0));
      }

      for (let i = 0; i < list.length; i++) {
        const cand = list[i];
        const rank = i + 1;
        let result = 'tidak_diterima';
        if (rank <= quota) {
          result = 'diterima';
        } else if (rank <= quota + 5) {
          result = 'cadangan';
        }

        await updateCandidateSelection(cand.id, result, rank);
        updatedCount++;
      }
    }

    res.json({ success: true, updatedCount });
  } catch (error: any) {
    console.error('Error in POST /api/candidates/calculate-selection:', error);
    res.status(500).json({ error: error.message || 'Calculation failed' });
  }
});

// Admin Authentication (Email/Username + Password)
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/username dan password wajib diisi' });
  }

  try {
    await seedInitialAdminsIfEmpty(INITIAL_ADMINS);
    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      return res.status(401).json({ error: 'Email atau password panitia tidak sesuai atau akun tidak aktif' });
    }
    res.json({ success: true, admin });
  } catch (error: any) {
    console.error('Error in POST /api/admin/login:', error);
    res.status(500).json({ error: error.message || 'Gagal login admin' });
  }
});

// Get All Admin Accounts
app.get('/api/admin/accounts', async (req, res) => {
  try {
    await seedInitialAdminsIfEmpty(INITIAL_ADMINS);
    const list = await getAllAdminAccounts();
    res.json(list);
  } catch (error: any) {
    console.error('Error in GET /api/admin/accounts:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch admin accounts' });
  }
});

// Create New Admin Account
app.post('/api/admin/accounts', async (req, res) => {
  const { name, email, role, roleLabel, password, assignedJalur } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nama, email, dan password wajib diisi' });
  }

  try {
    const created = await insertAdminAccount({
      name,
      email,
      role: role || 'verifikator',
      roleLabel: roleLabel || 'Panitia Verifikator',
      password,
      assignedJalur: assignedJalur || 'semua',
    });
    res.status(201).json(created);
  } catch (error: any) {
    console.error('Error in POST /api/admin/accounts:', error);
    res.status(500).json({ error: error.message || 'Gagal membuat akun admin baru' });
  }
});

// Update Admin Account
app.put('/api/admin/accounts/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid admin ID' });

  try {
    const updated = await updateAdminAccountById(id, req.body);
    if (!updated) return res.status(404).json({ error: 'Admin account not found' });
    res.json(updated);
  } catch (error: any) {
    console.error('Error in PUT /api/admin/accounts/:id:', error);
    res.status(500).json({ error: error.message || 'Failed to update admin account' });
  }
});

// Delete Admin Account
app.delete('/api/admin/accounts/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid admin ID' });

  try {
    const deleted = await deleteAdminAccountById(id);
    if (!deleted) return res.status(404).json({ error: 'Admin account not found' });
    res.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/accounts/:id:', error);
    res.status(500).json({ error: error.message || 'Failed to delete admin account' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SPMB Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
