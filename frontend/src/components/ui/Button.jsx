/**
 * Shared Button — previously CTAs were styled three different ways
 * (plain Tailwind classes, inline gradient `style={{...}}`, and flat
 * `bg-teal-950`), so every button on the site looked and behaved
 * slightly differently. One component, one set of variants.
 */

const VARIANTS = {
  primary: "bg-brand-gradient text-white hover:opacity-90",
  secondary: "border border-gray-300 text-gray-600 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
};

const SIZES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  as: Component = "button",
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
