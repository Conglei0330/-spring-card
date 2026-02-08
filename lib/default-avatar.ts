// 默认头像（鎏金渐变 + 🐴 图标）
export const DEFAULT_AVATAR = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D32F2F" />
      <stop offset="100%" style="stop-color:#FFD700" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="50" fill="url(#grad)" />
  <text x="50" y="65" font-size="40" text-anchor="middle" fill="white" font-weight="bold">🐴</text>
</svg>
`)}`;
