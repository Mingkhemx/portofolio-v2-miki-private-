export function getAuthHeaders() {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function fetchPortfolioApi() {
  const res = await fetch('/api/portfolio');
  if (!res.ok) throw new Error('Gagal memuat data portfolio');
  return res.json();
}

export async function sendMessageApi(messageData) {
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal mengirim pesan');
  return data;
}

export async function loginApi(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login gagal');
  return data;
}

export async function checkSessionApi() {
  const res = await fetch('/api/auth/session', {
    headers: getAuthHeaders()
  });
  if (!res.ok) return { isAuthenticated: false, user: null };
  return res.json();
}

export async function fetchMessagesApi() {
  const res = await fetch('/api/admin/messages', {
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal mengambil pesan');
  return data;
}

export async function deleteMessageApi(id) {
  const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Gagal menghapus pesan');
  return data;
}

export async function saveHeroApi(hero) {
  const res = await fetch('/api/admin/hero', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(hero)
  });
  if (!res.ok) throw new Error('Gagal memperbarui hero');
  return res.json();
}

export async function saveAboutApi(about) {
  const res = await fetch('/api/admin/about', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(about)
  });
  if (!res.ok) throw new Error('Gagal memperbarui about');
  return res.json();
}

export async function saveSkillsApi(skills) {
  const res = await fetch('/api/admin/skills', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(skills)
  });
  if (!res.ok) throw new Error('Gagal memperbarui skills');
  return res.json();
}

export async function saveCertificatesApi(certificates) {
  const res = await fetch('/api/admin/certificates', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(certificates)
  });
  if (!res.ok) throw new Error('Gagal memperbarui sertifikat');
  return res.json();
}

export async function saveContactsApi(contacts) {
  const res = await fetch('/api/admin/contacts', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(contacts)
  });
  if (!res.ok) throw new Error('Gagal memperbarui kontak');
  return res.json();
}

export async function saveSocialsApi(socials) {
  const res = await fetch('/api/admin/socials', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(socials)
  });
  if (!res.ok) throw new Error('Gagal memperbarui media sosial');
  return res.json();
}

export async function saveProjectsApi(projects) {
  const res = await fetch('/api/admin/projects', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(projects)
  });
  if (!res.ok) throw new Error('Gagal memperbarui proyek');
  return res.json();
}

export async function toggleHighlightApi(projectTitle) {
  const res = await fetch('/api/admin/highlights/toggle', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ projectTitle })
  });
  if (!res.ok) throw new Error('Gagal memperbarui sorotan');
  return res.json();
}

export async function saveSongsApi(songs) {
  const res = await fetch('/api/admin/songs', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(songs)
  });
  if (!res.ok) throw new Error('Gagal memperbarui lagu');
  return res.json();
}

export async function uploadAssetApi(file, folder = 'images') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            dataBase64: reader.result,
            filename: file.name,
            folder
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal mengunggah berkas ke Neon S3');
        resolve(data.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
