// 토큰 업데이트 콜백 (useAuthStore에서 등록)
let onTokensUpdated: ((accessToken: string, refreshToken: string | null) => void) | null = null;
let onAuthCleared: (() => void) | null = null;

export function registerTokenCallbacks(
  onUpdate: (accessToken: string, refreshToken: string | null) => void,
  onClear: () => void
) {
  onTokensUpdated = onUpdate;
  onAuthCleared = onClear;
}

export function notifyTokensUpdated(accessToken: string, refreshToken: string | null) {
  if (onTokensUpdated) {
    onTokensUpdated(accessToken, refreshToken);
  }
}

export function notifyAuthCleared() {
  if (onAuthCleared) {
    onAuthCleared();
  }
}
