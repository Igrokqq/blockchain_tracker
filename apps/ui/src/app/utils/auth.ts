// utils/auth.ts
export const logout = () => {
  localStorage.removeItem('access_token');
};
