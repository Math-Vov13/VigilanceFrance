// tokenService.ts
export const tokenService = {
    getRefreshToken: (): string | null => localStorage.getItem('refresh_token'),
    setRefreshToken: (token: string): void => localStorage.setItem('refresh_token', token),
    clearRefreshToken: (): void => localStorage.removeItem('refresh_token')
  };
  