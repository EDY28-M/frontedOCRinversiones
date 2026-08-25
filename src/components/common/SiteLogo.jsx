import { usePublicSiteSettings } from '../../hooks/usePublicSiteSettings';
import { resolveMediaUrl } from '../../utils/mediaUrl';

/**
 * Marca ORC: usa el logo subido en Personalización, o el lockup por defecto.
 */
export default function SiteLogo({
  variant = 'header',
  iconClassName = 'text-primary',
}) {
  const { logoUrl, updatedAt } = usePublicSiteSettings();
  const src = resolveMediaUrl(logoUrl);

  if (src) {
    const height =
      variant === 'admin' ? 'h-20' : variant === 'footer' ? 'h-10' : 'h-12';
    const version = updatedAt ? new Date(updatedAt).getTime() : '';
    const srcWithVersion = version
      ? `${src}${src.includes('?') ? '&' : '?'}v=${version}`
      : src;
    return (
      <img
        src={srcWithVersion}
        alt="ORC Inversiones Perú"
        className={`${height} w-auto max-w-[220px] object-contain`}
      />
    );
  }

  const titleClass =
    variant === 'footer'
      ? 'text-2xl font-display font-medium uppercase tracking-tighter leading-none block'
      : variant === 'mobile'
        ? 'text-xl font-display font-medium uppercase tracking-tighter leading-none'
        : 'text-2xl font-display font-medium uppercase tracking-tighter leading-none block';

  return (
    <div className="flex items-center gap-3 min-w-fit">
      <div className={iconClassName}>
        <span className="material-symbols-outlined text-3xl">settings_b_roll</span>
      </div>
      <div>
        {variant === 'mobile' ? (
          <h2 className={titleClass}>ORC</h2>
        ) : (
          <span className={titleClass}>ORC</span>
        )}
        <p className="text-accent text-[11px] font-bold uppercase tracking-[0.2em] leading-none mt-1">
          Inversiones Perú
        </p>
      </div>
    </div>
  );
}
