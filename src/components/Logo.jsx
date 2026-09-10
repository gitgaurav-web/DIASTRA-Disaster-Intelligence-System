export default function Logo({ className = 'w-6 h-6', variant = 'dark' }) {
  const primary = variant === 'dark' ? '#1d4ed8' : '#3b82f6';
  const accent = variant === 'dark' ? '#2563eb' : '#60a5fa';
  const ring = variant === 'dark' ? '#1e293b' : '#ffffff';
  const text = variant === 'dark' ? '#334155' : '#ffffff';

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="NDMA Sentinel-DSS Logo"
    >
      {/* Outer radar ring */}
      <circle cx="24" cy="24" r="22" stroke={ring} strokeWidth="1.5" opacity="0.25" />
      <circle cx="24" cy="24" r="17" stroke={accent} strokeWidth="1.5" opacity="0.5" />

      {/* Radar sweep */}
      <path d="M24 24 L24 7 A17 17 0 0 1 38 14 Z" fill={accent} opacity="0.18" />

      {/* Mountain peaks (hazard/terrain) */}
      <path d="M10 36 L18 22 L24 30 L31 18 L38 36 Z" fill={primary} opacity="0.85" />
      <path d="M18 22 L21 27 L24 30 L31 18 L28 15 Z" fill={ring} opacity="0.3" />

      {/* Location pin on peak */}
      <circle cx="31" cy="18" r="3" fill={accent} />
      <circle cx="31" cy="18" r="1.5" fill={ring} />

      {/* Concentric signal rings around pin */}
      <circle cx="31" cy="18" r="5.5" stroke={accent} strokeWidth="1" opacity="0.4" fill="none" />

      {/* Base bar (ground/monitoring) */}
      <rect x="8" y="37" width="32" height="3" rx="1.5" fill={primary} />
    </svg>
  );
}
