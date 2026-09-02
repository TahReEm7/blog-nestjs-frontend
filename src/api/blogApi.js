const API_URL = 'http://localhost:5000';

export const getBlogs = async () => {
  const response = await fetch(`${API_URL}/blogs`);

  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }

  return response.json();
};

export const getBlogById = async (id) => {
  const response = await fetch(`${API_URL}/blogs/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch blog details');
  }

  return response.json();
};

export const createBlog = async (blogData) => {
  const response = await fetch(`${API_URL}/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...blogData,
      views: 0,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to create blog');
  }

  return response.json();
};