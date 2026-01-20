// tokenService.ts
export const tokenService = {
    getRefreshToken: (): string | null => {
      const token = localStorage.getItem('refresh_token');
      console.log('📖 Getting refresh token from localStorage:', token ? '✅ Found' : '❌ Not found');
      return token;
    },
    setRefreshToken: (token: string): void => {
      console.log('💾 Saving refresh token to localStorage:', token);
      localStorage.setItem('refresh_token', token);
      // Verify it was saved
      const saved = localStorage.getItem('refresh_token');
      console.log('✔️ Verification - Token saved:', saved === token ? '✅ Success' : '❌ Failed');
    },
    clearRefreshToken: (): void => {
      console.log('🗑️ Clearing refresh token from localStorage');
      localStorage.removeItem('refresh_token');
    }
  };
