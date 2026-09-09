const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

const readResponse = async (response, fallbackMessage) => {
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message = typeof data === 'object' && data !== null
      ? data.message
      : data;
    throw new Error(Array.isArray(message) ? message.join(', ') : message || fallbackMessage);
  }

  return data;
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);

  return readResponse(response, 'Failed to fetch users');
};

export const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`);

  return readResponse(response, 'Failed to fetch user');
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return readResponse(response, 'Failed to create user');
};

export const updateUser = async (id, userData) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return readResponse(response, 'Failed to update profile');
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });

  return readResponse(response, 'Failed to delete profile');
};

export const loginUser = async (email, password) => {
  const users = await getUsers();

  const existingUser = users.find(
    (user) =>
      user.email?.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    if (
      existingUser.password &&
      existingUser.password !== password
    ) {
      throw new Error('Invalid password');
    }

    return existingUser;
  }

  const newUser = await createUser({
    name: email.split('@')[0],
    email,
    password,
  });

  return newUser;
};

export const blogByUser = async (userId) => {
  const response = await fetch(
    `${API_URL}/users/${userId}/blogs`
  );

  return readResponse(response, 'Failed to fetch blogs for user');
};

