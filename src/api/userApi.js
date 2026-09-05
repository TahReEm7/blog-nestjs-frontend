const API_URL = 'http://localhost:5000';

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

export const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
};

export const createUser = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to create user');
  }

  return response.json();
};

export const loginUser = async (email, password) => {
  const users = await getUsers();
  const existingUser = users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    if (existingUser.password && existingUser.password !== password) {
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
  const response = await fetch(`${API_URL}/users/${userId}/blogs`);

  if (!response.ok) {
    throw new Error('Failed to fetch blogs for user');
  }

  return response.json();
};