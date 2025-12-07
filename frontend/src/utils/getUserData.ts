export function getUserData() {
  if (typeof window !== 'undefined') {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        return JSON.parse(storedUserData);
      } catch {
        return null;
      }
    }
  }
  return null;
}
