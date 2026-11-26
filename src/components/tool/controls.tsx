'use client';

import { useId, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { UiIcon, type UiIconName } from '../Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-fg hover:bg-accent-hover border border-transparent',
  secondary: 'bg-card text-fg border border-border-strong hover:bg-bg-muted',
  ghost: 'bg-transparent text-fg-muted border border-transparent hover:bg-bg-muted hover:text-fg',
  danger: 'bg-card text-danger border border-border-strong hover:bg-danger-soft',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: UiIconName;
  size?: 'sm' | 'md';
}

export function Button({
  variant = 'secondary',
  icon,
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const sizing = size === 'sm' ? 'h-9 px-3 text-sm gap-1.5' : 'h-10 px-4 text-[0.95rem] gap-2';
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-lg font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${sizing} ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {icon ? (
        <UiIcon name={icon} className={size === 'sm' ? 'h-4 w-4' : 'h-[18px] w-[18px]'} />
      ) : null}
      {children}
    </button>
  );
}

/** Row of action buttons; wraps on small screens. */
export function ActionBar({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`flex flex-wrap items-center gap-2 ${className}`}>{children}</div>;
}

interface TextAreaProps {
  id?: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  rows?: number;
  invalid?: boolean;
  describedBy?: string;
  mono?: boolean;
  hideLabel?: boolean;
  className?: string;
  extra?: ReactNode;
}

export function TextArea({
  id,
  label,
  value,
  onChange,
  readOnly,
  placeholder,
  rows = 14,
  invalid,
  describedBy,
  mono = true,
  hideLabel,
  className = '',
  extra,
}: TextAreaProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={`flex min-w-0 flex-col ${className}`}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label
          htmlFor={fieldId}
          className={hideLabel ? 'sr-only' : 'text-sm font-semibold text-fg'}
        >
          {label}
        </label>
        {extra}
      </div>
      <textarea
        id={fieldId}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        placeholder={placeholder}
        rows={rows}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`block w-full resize-y rounded-lg border bg-card p-3 text-sm leading-relaxed text-fg placeholder:text-fg-muted focus:border-accent ${
          mono ? 'font-mono' : ''
        } ${invalid ? 'border-danger' : 'border-border-strong'} ${readOnly ? 'bg-bg-subtle' : ''}`}
      />
    </div>
  );
}

interface SelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}

export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  className = '',
}: SelectProps<T>) {
  const id = useId();
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="mb-1 text-sm font-medium text-fg">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-10 rounded-lg border border-border-strong bg-card px-3 text-[0.95rem] text-fg focus:border-accent"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}) {
  const id = useId();
  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-describedby={description ? `${id}-d` : undefined}
        className="mt-1 h-[18px] w-[18px] shrink-0 accent-[var(--accent)]"
      />
      <label htmlFor={id} className="text-[0.95rem] text-fg select-none">
        {label}
        {description ? (
          <span id={`${id}-d`} className="block text-xs text-fg-muted">
            {description}
          </span>
        ) : null}
      </label>
    </div>
  );
}

/** Accessible radio group rendered as a segmented control. */
export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  const name = useId();
  return (
    <fieldset className="flex flex-col">
      <legend className="mb-1 text-sm font-medium text-fg">{label}</legend>
      <div className="inline-flex flex-wrap rounded-lg border border-border-strong bg-bg-subtle p-0.5">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <label
              key={o.value}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-[var(--ring)] ${
                active ? 'bg-card text-fg shadow-sm' : 'text-fg-muted hover:text-fg'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={active}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  className = '',
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  suffix?: string;
}) {
  const id = useId();
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="mb-1 text-sm font-medium text-fg">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={Number.isFinite(value) ? value : ''}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className="h-10 w-28 rounded-lg border border-border-strong bg-card px-3 text-[0.95rem] text-fg focus:border-accent"
        />
        {suffix ? <span className="text-sm text-fg-muted">{suffix}</span> : null}
      </div>
    </div>
  );
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  className = '',
  mono,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  mono?: boolean;
  type?: 'text' | 'url' | 'email' | 'tel' | 'search';
}) {
  const id = useId();
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="mb-1 text-sm font-medium text-fg">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        className={`h-10 rounded-lg border border-border-strong bg-card px-3 text-[0.95rem] text-fg placeholder:text-fg-muted focus:border-accent ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

export function ErrorAlert({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-lg border border-danger/40 bg-danger-soft p-3 text-sm text-fg"
    >
      <UiIcon name="alert" className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
      <div className="min-w-0">
        <p className="font-semibold text-danger">{title}</p>
        {children ? <div className="mt-0.5 break-words">{children}</div> : null}
      </div>
    </div>
  );
}

export function InfoNote({
  children,
  tone = 'info',
}: {
  children: ReactNode;
  tone?: 'info' | 'warning' | 'success';
}) {
  const styles = {
    info: 'border-border bg-bg-subtle text-fg',
    warning: 'border-warning/40 bg-warning-soft text-fg',
    success: 'border-success/40 bg-success-soft text-fg',
  }[tone];
  const icon = tone === 'success' ? 'check' : tone === 'warning' ? 'alert' : 'info';
  return (
    <div className={`flex gap-2.5 rounded-lg border p-3 text-sm ${styles}`}>
      <UiIcon
        name={icon}
        className={`mt-0.5 h-4 w-4 shrink-0 ${tone === 'success' ? 'text-success' : tone === 'warning' ? 'text-warning' : 'text-fg-muted'}`}
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** The privacy note required on every tool that handles files. */
export function PrivacyNote() {
  return (
    <p className="flex items-center gap-2 text-sm text-fg-muted">
      <UiIcon name="shield" className="h-4 w-4 shrink-0 text-success" />
      Your files never leave your device. Processing happens in your browser.
    </p>
  );
}

/** Card wrapper for a tool UI. */
export function ToolPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

/** Labeled range slider showing its current value. */
export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = '',
  disabled,
  className = '',
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  disabled?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`flex min-w-48 flex-col ${disabled ? 'opacity-50' : ''} ${className}`}>
      <label htmlFor={id} className="mb-1 flex justify-between text-sm font-medium text-fg">
        <span>{label}</span>
        <output htmlFor={id} className="font-mono tabular-nums">
          {value}
          {suffix}
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-10 accent-[var(--accent)]"
      />
    </div>
  );
}

/** Labeled color picker with its hex value. */
export function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 text-sm font-medium text-fg">
        {label}
      </label>
      <div className="flex h-10 items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-border-strong bg-card p-1"
        />
        <span className="font-mono text-sm text-fg-muted">{value}</span>
      </div>
    </div>
  );
}
