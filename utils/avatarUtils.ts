/**
 * Utility to generate high-resolution, personalized avatars derived from user email.
 * Supports Google / Gravatar / GitHub avatar resolution with brand-tailored fallback.
 */

export function getEmailAvatar(email: string, name?: string): string {
  if (!email || typeof email !== 'string') return '';

  const cleanEmail = email.trim().toLowerCase();
  const rawName = name?.trim() || cleanEmail.split('@')[0] || 'Athlete';
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  // Encode for safe URL parameter embedding
  const encodedName = encodeURIComponent(displayName);
  const encodedEmail = encodeURIComponent(cleanEmail);

  // High-resolution branded SVG fallback (FitFlow #111312 dark background with #B8F45A lime initials)
  const brandedFallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&backgroundColor=111312&textColor=B8F45A&fontSize=42&fontWeight=800`;

  // unavatar.io automatically resolves real Google, Gravatar, and GitHub avatars tied to the email,
  // falling back seamlessly to the branded Dicebear initials avatar if none exists.
  return `https://unavatar.io/${encodedEmail}?fallback=${encodeURIComponent(brandedFallback)}`;
}
