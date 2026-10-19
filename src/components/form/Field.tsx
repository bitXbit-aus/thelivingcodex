import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { errorTextClass, helpClass, labelClass } from "./styles";

interface FieldProps {
  id: string;
  label: string;
  children: ReactNode;
  /** Visible helper text. Rendered only when supplied. */
  help?: ReactNode;
  helpId?: string;
  /** Validation message. Rendered only when supplied. */
  error?: string;
  errorId?: string;
  required?: boolean;
  className?: string;
}

/**
 * A labelled form control with optional help text and an error message.
 *
 * The visible label is styled uppercase for the site's visual language, but
 * `text-transform` leaks into the accessible-name computation in some browsers
 * (the AX tree then exposes "CREATOR / SOUL NAME"). The control therefore gets
 * an explicit normal-case `aria-label`, and `aria-describedby` references both
 * the help text AND the error, so neither is lost while an error is shown.
 */
export default function Field({
  id,
  label,
  children,
  help,
  helpId,
  error,
  errorId,
  required = false,
  className,
}: FieldProps) {
  const describedBy =
    [help ? helpId : undefined, error ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        "aria-label": label,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })
    : children;

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {control}
      {help && helpId && (
        <p id={helpId} className={helpClass}>
          {help}
        </p>
      )}
      {error && errorId && (
        <p id={errorId} className={errorTextClass}>
          {error}
        </p>
      )}
    </div>
  );
}
