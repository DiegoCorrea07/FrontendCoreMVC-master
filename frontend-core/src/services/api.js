const BASE = 'https://administracion-core-mvc.onrender.com'
export async function login(username, password) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  // Mejorar el manejo de errores para que lance una excepción si no es exitoso
  const json = await res.json()
  if (!res.ok) {
    // Si el backend devuelve un 'message' en el cuerpo del error, úsalo.
    throw new Error(json.message || 'Error en el login.');
  }
  return json
}

export async function getAll(resource, token) {
  const res = await fetch(`${BASE}/${resource}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  // Mejorar el manejo de errores
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.message || `Error al obtener todos los recursos de ${resource}.`);
  }
  return json
}

export async function getOne(resourcePath, token) {
  try {
    const response = await fetch(`${BASE}/${resourcePath}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json(); // Siempre intenta parsear el JSON
    if (!response.ok) {
      // Si la respuesta no es OK, lanza un error con el mensaje del backend
      throw new Error(data.message || `Error al obtener ${resourcePath}.`);
    }
    return data;
  } catch (error) {
    console.error('API Error en getOne:', error);
    // Vuelve a lanzar el error para que el componente que llama lo maneje
    throw error;
  }
}

export async function createOne(resource, data, token) {
  const res = await fetch(`${BASE}/${resource}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const json = await res.json();

  if (!res.ok) {
    // Usar 'message' si tu backend lo devuelve, o 'error' como fallback
    throw new Error(json.message || json.error || 'Error en la solicitud de creación.');
  }

  return json;
}

export async function updateOne(resource, id, data, token) {
  const res = await fetch(`${BASE}/${resource}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  // Mejorar el manejo de errores
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.message || `Error al actualizar el recurso ${id}.`);
  }
  return json
}

export async function deleteOne(resource, id, token) {
  const res = await fetch(`${BASE}/${resource}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  // Mejorar el manejo de errores
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json.message || `Error al eliminar el recurso ${id}.`);
  }
  return json
}