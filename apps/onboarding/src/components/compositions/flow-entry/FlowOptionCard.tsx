import { AlIcon } from '@autolokate/icons';

import './flow-option-card.css';

export type FlowOptionCardProps = {
  label: string;
  description?: string;
  onSelect: () => void;
};

export function FlowOptionCard({ label, description, onSelect }: FlowOptionCardProps) {
  return (
    <button type="button" className="ob-flow-option" onClick={onSelect}>
      <span className="ob-flow-option__copy">
        <span className="ob-flow-option__label">{label}</span>
        {description ? <span className="ob-flow-option__description">{description}</span> : null}
      </span>
      <AlIcon
        name="chevron-down"
        size={20}
        className="ob-flow-option__chevron"
        aria-hidden
      />
    </button>
  );
}
