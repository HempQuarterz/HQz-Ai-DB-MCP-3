export function getPlaceholderImage(width: number, height: number, text?: string): string {
  // Use a data URL for a simple placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1f2937"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" fill="#6b7280" text-anchor="middle" dy="0.3em">
        ${text || 'Hemp Plant Type'}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}