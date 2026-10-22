import { neon } from '@neondatabase/serverless';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config?.();

const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'migwaraa@gmail.com').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'neon-portfolio-secure-key-2026';

const S3_ENDPOINT = process.env.AWS_ENDPOINT_URL_S3 || 'https://br-withered-wave-a1box3ug.storage.c-1.ap-southeast-1.aws.neon.tech';
const S3_REGION = process.env.AWS_REGION || 'ap-southeast-1';
const S3_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const S3_SECRET = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'portofolio';

function getS3Client() {
  if (!S3_KEY_ID || !S3_SECRET) return null;
  return new S3Client({
    endpoint: S3_ENDPOINT,
    region: S3_REGION,
    credentials: {
      accessKeyId: S3_KEY_ID,
      secretAccessKey: S3_SECRET
    },
    forcePathStyle: true
  });
}

function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'svg': return 'image/svg+xml';
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    default: return 'application/octet-stream';
  }
}

function getDb() {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }
  return neon(DATABASE_URL);
}

function createToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (signature !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function extractToken(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (req.body && typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

  const urlObj = new URL(req.url, 'http://localhost');
  let pathname = urlObj.pathname;

  // Normalize path if deployed as /api or rewrite
  if (pathname.endsWith('/') && pathname.length > 1) {
    pathname = pathname.slice(0, -1);
  }

  const queryParams = Object.fromEntries(urlObj.searchParams.entries());

  try {
    const sql = getDb();

    // 1. PUBLIC: GET /api/portfolio
    if (req.method === 'GET' && (pathname === '/api/portfolio' || pathname === '/portfolio')) {
      const [heroRows, aboutRows, skillsRows, certsRows, contactsRows, socialsRows, projectsRows, highlightsRows, songsRows] = await Promise.all([
        sql.query('SELECT * FROM hero WHERE id = 1 LIMIT 1'),
        sql.query('SELECT * FROM about WHERE id = 1 LIMIT 1'),
        sql.query('SELECT * FROM skills ORDER BY id ASC'),
        sql.query('SELECT * FROM certificates ORDER BY id ASC'),
        sql.query('SELECT * FROM contacts ORDER BY id ASC'),
        sql.query('SELECT * FROM socials ORDER BY id ASC'),
        sql.query('SELECT * FROM projects ORDER BY created_at DESC'),
        sql.query('SELECT * FROM highlights'),
        sql.query('SELECT * FROM songs ORDER BY id ASC')
      ]);

      return sendJson(res, 200, {
        hero: heroRows[0] || null,
        about: aboutRows[0] || null,
        skills: skillsRows || [],
        certificates: certsRows || [],
        contacts: contactsRows || [],
        socials: socialsRows || [],
        projects: projectsRows || [],
        highlights: (highlightsRows || []).map(h => h.project_title),
        songs: songsRows || []
      });
    }

    // 2. PUBLIC: POST /api/messages (Contact Form)
    if (req.method === 'POST' && (pathname === '/api/messages' || pathname === '/messages')) {
      const body = await parseBody(req);
      const { name, email, subject, message } = body;

      if (!name || !message) {
        return sendJson(res, 400, { error: 'Nama dan pesan wajib diisi' });
      }

      await sql.query(
        'INSERT INTO messages (name, email, subject, message) VALUES ($1, $2, $3, $4)',
        [name, email || '', subject || '', message]
      );

      return sendJson(res, 201, { success: true, message: 'Pesan berhasil disimpan' });
    }

    // 3. PUBLIC: POST /api/auth/login
    if (req.method === 'POST' && (pathname === '/api/auth/login' || pathname === '/auth/login')) {
      const body = await parseBody(req);
      const { username, password } = body;

      const inputUser = (username || '').trim().toLowerCase();
      const adminBase = ADMIN_USERNAME.split('@')[0];

      const isMatch = (inputUser === ADMIN_USERNAME || inputUser === adminBase) && password === ADMIN_PASSWORD;

      if (!isMatch) {
        return sendJson(res, 401, { error: 'Username atau Password salah!' });
      }

      const token = createToken({ username: ADMIN_USERNAME, role: 'admin' });
      return sendJson(res, 200, {
        success: true,
        token,
        user: { email: ADMIN_USERNAME, role: 'admin' }
      });
    }

    // 4. CHECK SESSION: GET /api/auth/session
    if (req.method === 'GET' && (pathname === '/api/auth/session' || pathname === '/auth/session')) {
      const token = extractToken(req);
      const payload = verifyToken(token);
      if (!payload) {
        return sendJson(res, 200, { isAuthenticated: false, user: null });
      }
      return sendJson(res, 200, { isAuthenticated: true, user: { email: payload.username, role: payload.role } });
    }

    // --- PROTECTED ADMIN ROUTES ---
    const token = extractToken(req);
    const authUser = verifyToken(token);

    if (!authUser) {
      return sendJson(res, 401, { error: 'Akses ditolak: Token autentikasi tidak valid atau kedaluwarsa' });
    }

    // 5. ADMIN: GET /api/admin/messages
    if (req.method === 'GET' && (pathname === '/api/admin/messages' || pathname === '/admin/messages')) {
      const messages = await sql.query('SELECT * FROM messages ORDER BY created_at DESC');
      return sendJson(res, 200, messages);
    }

    // 6. ADMIN: DELETE /api/admin/messages
    if (req.method === 'DELETE' && (pathname === '/api/admin/messages' || pathname === '/admin/messages')) {
      const id = queryParams.id;
      if (!id) {
        return sendJson(res, 400, { error: 'ID pesan wajib disertakan' });
      }
      await sql.query('DELETE FROM messages WHERE id = $1', [id]);
      return sendJson(res, 200, { success: true, message: 'Pesan berhasil dihapus' });
    }

    // 7. ADMIN: POST /api/admin/hero
    if (req.method === 'POST' && (pathname === '/api/admin/hero' || pathname === '/admin/hero')) {
      const body = await parseBody(req);
      await sql.query(
        `INSERT INTO hero (id, name, role, quotes) 
         VALUES (1, $1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, quotes = EXCLUDED.quotes`,
        [body.name, body.role, body.quotes]
      );
      return sendJson(res, 200, { success: true, hero: body });
    }

    // 8. ADMIN: POST /api/admin/about
    if (req.method === 'POST' && (pathname === '/api/admin/about' || pathname === '/admin/about')) {
      const body = await parseBody(req);
      await sql.query(
        `INSERT INTO about (id, name, subtitle, description, location, email, image) 
         VALUES (1, $1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO UPDATE SET 
           name = EXCLUDED.name, 
           subtitle = EXCLUDED.subtitle, 
           description = EXCLUDED.description, 
           location = EXCLUDED.location, 
           email = EXCLUDED.email, 
           image = EXCLUDED.image`,
        [body.name, body.subtitle, body.description, body.location, body.email, body.image]
      );
      return sendJson(res, 200, { success: true, about: body });
    }

    // 9. ADMIN: POST /api/admin/skills
    if (req.method === 'POST' && (pathname === '/api/admin/skills' || pathname === '/admin/skills')) {
      const body = await parseBody(req);
      const skills = Array.isArray(body) ? body : body.skills || [];
      await sql.query('DELETE FROM skills');
      for (const s of skills) {
        await sql.query('INSERT INTO skills (id, name, image) VALUES ($1, $2, $3)', [s.id, s.name, s.image]);
      }
      return sendJson(res, 200, { success: true, skills });
    }

    // 10. ADMIN: POST /api/admin/certificates
    if (req.method === 'POST' && (pathname === '/api/admin/certificates' || pathname === '/admin/certificates')) {
      const body = await parseBody(req);
      const certs = Array.isArray(body) ? body : body.certificates || [];
      await sql.query('DELETE FROM certificates');
      for (const c of certs) {
        await sql.query('INSERT INTO certificates (id, title, image, color) VALUES ($1, $2, $3, $4)', [c.id, c.title, c.image, c.color]);
      }
      return sendJson(res, 200, { success: true, certificates: certs });
    }

    // 11. ADMIN: POST /api/admin/contacts
    if (req.method === 'POST' && (pathname === '/api/admin/contacts' || pathname === '/admin/contacts')) {
      const body = await parseBody(req);
      const contacts = Array.isArray(body) ? body : body.contacts || [];
      await sql.query('DELETE FROM contacts');
      for (const c of contacts) {
        await sql.query('INSERT INTO contacts (id, type, value, link) VALUES ($1, $2, $3, $4)', [c.id, c.type, c.value, c.link]);
      }
      return sendJson(res, 200, { success: true, contacts });
    }

    // 12. ADMIN: POST /api/admin/socials
    if (req.method === 'POST' && (pathname === '/api/admin/socials' || pathname === '/admin/socials')) {
      const body = await parseBody(req);
      const socials = Array.isArray(body) ? body : body.socials || [];
      await sql.query('DELETE FROM socials');
      for (const s of socials) {
        await sql.query('INSERT INTO socials (id, platform, username, link, color) VALUES ($1, $2, $3, $4, $5)', [s.id, s.platform, s.username, s.link, s.color]);
      }
      return sendJson(res, 200, { success: true, socials });
    }

    // 13. ADMIN: POST /api/admin/projects
    if (req.method === 'POST' && (pathname === '/api/admin/projects' || pathname === '/admin/projects')) {
      const body = await parseBody(req);
      const projects = Array.isArray(body) ? body : body.projects || [];
      await sql.query('DELETE FROM projects');
      for (const p of projects) {
        await sql.query(
          `INSERT INTO projects (id, title, description, image, images, video, source_code, demo, tech, category)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            p.id,
            p.title,
            p.description,
            p.image,
            JSON.stringify(p.images || []),
            p.video || '',
            p.source_code || p.sourceCode || '#',
            p.demo || '',
            JSON.stringify(p.tech || []),
            p.category || 'Website'
          ]
        );
      }
      return sendJson(res, 200, { success: true, projects });
    }

    // 14. ADMIN: POST /api/admin/highlights/toggle
    if (req.method === 'POST' && (pathname === '/api/admin/highlights/toggle' || pathname === '/admin/highlights/toggle')) {
      const body = await parseBody(req);
      const { projectTitle } = body;
      const existing = await sql.query('SELECT * FROM highlights WHERE project_title = $1', [projectTitle]);
      if (existing.length > 0) {
        await sql.query('DELETE FROM highlights WHERE project_title = $1', [projectTitle]);
      } else {
        await sql.query('INSERT INTO highlights (project_title) VALUES ($1)', [projectTitle]);
      }
      const updated = await sql.query('SELECT * FROM highlights');
      return sendJson(res, 200, { success: true, highlights: updated.map(h => h.project_title) });
    }

    // 15. ADMIN: POST /api/admin/songs
    if (req.method === 'POST' && (pathname === '/api/admin/songs' || pathname === '/admin/songs')) {
      const body = await parseBody(req);
      const songs = Array.isArray(body) ? body : body.songs || [];
      await sql.query('DELETE FROM songs');
      for (const s of songs) {
        await sql.query(
          'INSERT INTO songs (id, title, artist, url, duration, color, tempo_speed) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [s.id, s.title, s.artist, s.url, s.duration, s.color, s.tempo_speed]
        );
      }
      return sendJson(res, 200, { success: true, songs });
    }

    // 16. ADMIN: POST /api/admin/upload
    if (req.method === 'POST' && (pathname === '/api/admin/upload' || pathname === '/admin/upload')) {
      const body = await parseBody(req);
      const { dataBase64, filename, folder } = body;

      if (!dataBase64 || !filename) {
        return sendJson(res, 400, { error: 'Berkas dan nama file wajib disertakan' });
      }

      const s3 = getS3Client();
      if (!s3) {
        return sendJson(res, 500, { error: 'Kredensial S3 belum dikonfigurasi' });
      }

      const matches = dataBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const pureBase64 = matches ? matches[2] : dataBase64;
      const buffer = Buffer.from(pureBase64, 'base64');

      const cleanFolder = folder || 'images';
      const cleanFileName = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const s3Key = `${cleanFolder}/${cleanFileName}`;
      const contentType = matches ? matches[1] : getMimeType(filename);

      await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        Body: buffer,
        ContentType: contentType
      }));

      const publicUrl = `${S3_ENDPOINT}/${BUCKET_NAME}/${s3Key}`;
      return sendJson(res, 200, { success: true, url: publicUrl, key: s3Key });
    }

    return sendJson(res, 404, { error: `Endpoint tidak ditemukan: ${pathname}` });
  } catch (err) {
    console.error('API Error:', err);
    return sendJson(res, 500, { error: 'Terjadi kesalahan internal server', details: err.message });
  }
}
