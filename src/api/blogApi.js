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

export const getBlogs = async () => {
  const response = await fetch(`${API_URL}/blogs`);

  return readResponse(response, 'Failed to fetch blogs');
};

export const getBlogById = async (id) => {
  const response = await fetch(`${API_URL}/blogs/${id}`);

  return readResponse(response, 'Failed to fetch blog details');
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

  return readResponse(response, 'Failed to create blog');
};

export const updateBlog = async (id, blogData) => {
  const response = await fetch(`${API_URL}/blogs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blogData),
  });

  return readResponse(response, 'Failed to update blog');
};

export const deleteBlog = async (id) => {
  const response = await fetch(`${API_URL}/blogs/${id}`, {
    method: 'DELETE',
  });

  return readResponse(response, 'Failed to delete blog');
};

export const blogByUser = async (userId) => {
  const response = await fetch(`${API_URL}/blogs/user/${userId}`);

  return readResponse(response, 'Failed to fetch blogs for user');
};
