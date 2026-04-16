export const API_BASE = "/api";

export const getToken = () => localStorage.getItem("tanora_token");
export const setToken = (t) => localStorage.setItem("tanora_token", t);
export const removeToken = () => localStorage.removeItem("tanora_token");
export const getAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem("tanora_admin") || "null");
  } catch {
    return null;
  }
};

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  } catch {
    console.error("Raw server response:", text);
    throw new Error("Server returned invalid response: " + text);
  }
}

// Add this helper with extra headers
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest", // ← this helps
      ...options.headers,
    },
  });
  return handleResponse(res);
}

export async function adminLogin(email, password) {
  const res = await fetch(`${API_BASE}/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(res);
  setToken(data.token);
  localStorage.setItem("tanora_admin", JSON.stringify(data.admin));
  return data;
}

export function adminLogout() {
  removeToken();
  localStorage.removeItem("tanora_admin");
}

export async function registerVolunteer(payload) {
  const res = await fetch(`${API_BASE}/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getVolunteers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/register.php?${qs}`, {
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function updateVolunteerStatus(id, status) {
  const res = await fetch(`${API_BASE}/register.php?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
}

export async function getSlots(month) {
  const res = await fetch(`${API_BASE}/slots.php?month=${month}`);
  return handleResponse(res);
}

export async function saveSlot(slot) {
  const res = await fetch(`${API_BASE}/slots.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(slot),
  });
  return handleResponse(res);
}

export async function deleteSlot(date) {
  const res = await fetch(`${API_BASE}/slots.php?date=${date}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function getPhotos(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/photos.php?${qs}`);
  return handleResponse(res);
}

export async function uploadPhoto(file, caption = "", albumId = null) {
  const form = new FormData();
  form.append("photo", file);
  if (caption) form.append("caption", caption);
  if (albumId) form.append("album_id", albumId);
  const res = await fetch(`${API_BASE}/photos.php`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  return handleResponse(res);
}

export async function deletePhoto(id) {
  const res = await fetch(`${API_BASE}/photos.php?id=${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function getAlbums() {
  const res = await fetch(`${API_BASE}/albums.php`);
  return handleResponse(res);
}

export async function createAlbum(title, description = "") {
  const res = await fetch(`${API_BASE}/albums.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ title, description }),
  });
  return handleResponse(res);
}
