import logoFigma from '@autolokate/brand/assets/al-logo-figma-dark.png';

/** Figma 158:25 — Logo component raster, 108×23.13 in PWA header. */
export function PwaHeaderBrand() {
  return (
    <div className="pwa-scan-shell__brand" aria-label="Autolokate">
      <img src={logoFigma} alt="Autolokate" className="pwa-scan-shell__logo-figma" />
    </div>
  );
}
