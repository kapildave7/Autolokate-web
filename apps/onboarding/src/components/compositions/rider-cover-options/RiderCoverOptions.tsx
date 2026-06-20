import { AlIcon } from '@autolokate/icons';

import type { PurchaseRiderCount } from '@/features/qr-purchase/types-checkout.js';
import { formatInr, getRiderPrice } from '@/features/qr-purchase/data/purchase-pricing.js';

import './rider-cover-options.css';

type RiderOption = {
  count: Exclude<PurchaseRiderCount, 0>;
  label: string;
  discountLabel: string;
  icon: 'user' | 'users';
  strikePrice: number;
};

const RIDER_OPTIONS: RiderOption[] = [
  {
    count: 1,
    label: '1 rider',
    discountLabel: '5% OFF',
    icon: 'user',
    strikePrice: 999,
  },
  {
    count: 2,
    label: '2 riders',
    discountLabel: '10% OFF',
    icon: 'users',
    strikePrice: 1998,
  },
];

export type RiderCoverOptionsProps = {
  selectedCount: Exclude<PurchaseRiderCount, 0>;
  onSelect: (count: Exclude<PurchaseRiderCount, 0>) => void;
};

/** Figma R07 layout_TV8XSJ — option cards with radio, discount chip, pricing. */
export function RiderCoverOptions({ selectedCount, onSelect }: RiderCoverOptionsProps) {
  return (
    <div className="ob-rider-cover-options" role="radiogroup" aria-label="Rider cover options">
      {RIDER_OPTIONS.map((option) => {
        const selected = option.count === selectedCount;
        const price = getRiderPrice(option.count);
        return (
          <button
            key={option.count}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`ob-rider-cover-option${selected ? ' ob-rider-cover-option--selected' : ''}`}
            onClick={() => {
              onSelect(option.count);
            }}
          >
            <span className="ob-rider-cover-option__radio-slot" aria-hidden>
              <span className="ob-rider-cover-option__radio ob-rider-cover-option__radio--empty" />
              <AlIcon
                name="circle-check"
                size={22}
                className="ob-rider-cover-option__radio ob-rider-cover-option__radio--check"
              />
            </span>
            <AlIcon name={option.icon} size={22} className="ob-rider-cover-option__icon" aria-hidden />
            <div className="ob-rider-cover-option__body">
              <div className="ob-rider-cover-option__title-row">
                <span className="ob-rider-cover-option__title">{option.label}</span>
                <span className="ob-rider-cover-option__discount">{option.discountLabel}</span>
              </div>
              <span className="ob-rider-cover-option__subtitle">₹1L cover for each rider</span>
            </div>
            <div className="ob-rider-cover-option__price-col">
              <span className="ob-rider-cover-option__price">{formatInr(price)}/yr</span>
              <span className="ob-rider-cover-option__strike">{formatInr(option.strikePrice)}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
