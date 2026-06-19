import { cn } from '../../../utils/cn.js';

import type { AlScannedVehicleCardProps } from './ScannedVehicleCard.types.js';
import './ScannedVehicleCard.css';

function CarGlyph() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 17h2M17 17h2M3 11l2-5h14l2 5M5 11v6h14v-6"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldCheckGlyph() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 13C20 18 16.5 20.5 12.34 21.95C12.1222 22.0238 11.8855 22.0202 11.67 21.94C7.5 20.5 4 18 4 13V6C4 5.73478 4.10536 5.48043 4.29289 5.29289C4.48043 5.10536 4.73478 5 5 5C7 5 9.5 3.8 11.24 2.28C11.4519 2.09896 11.7214 1.99951 12 1.99951C12.2786 1.99951 12.5481 2.09896 12.76 2.28C14.51 3.81 17 5 19 5C19.2652 5 19.5196 5.10536 19.7071 5.29289C19.8946 5.48043 20 5.73478 20 6V13Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma 843:2080 · 1034:2351 · 1040:2374 — compact vehicle chip card. */
export function AlScannedVehicleCard({
  plate,
  model,
  footerLabel,
  protectedLabel,
  protected: protectedVariant = false,
  className,
}: AlScannedVehicleCardProps) {
  const resolvedFooter = footerLabel ?? protectedLabel;

  return (
    <article
      className={cn(
        'al-scanned-vehicle-card',
        protectedVariant && 'al-scanned-vehicle-card--protected',
        className,
      )}
    >
      <div className="al-scanned-vehicle-card__header">
        <span className="al-scanned-vehicle-card__car-tile">
          <CarGlyph />
        </span>
        <div className="al-scanned-vehicle-card__copy">
          <p className="al-scanned-vehicle-card__plate">{plate}</p>
          <p className="al-scanned-vehicle-card__model">{model}</p>
        </div>
      </div>
      {resolvedFooter ? (
        <>
          <hr className="al-scanned-vehicle-card__divider" />
          <p className="al-scanned-vehicle-card__shield">
            <span className="al-scanned-vehicle-card__shield-icon">
              <ShieldCheckGlyph />
            </span>
            {resolvedFooter}
          </p>
        </>
      ) : null}
    </article>
  );
}
