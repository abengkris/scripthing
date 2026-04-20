export const api = {
  get: async (url: string) => {
    const response = await fetch(`http://localhost:3001/api/v1${url}`);
    return response.json();
  },
  post: async (url: string, data: any) => {
    const response = await fetch(`http://localhost:3001/api/v1${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};
