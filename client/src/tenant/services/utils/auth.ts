export const isAuthenticated = (): boolean =>
    Boolean(localStorage.getItem('token'));