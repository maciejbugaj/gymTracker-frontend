export type ButtonVariant = 'solid' | 'quiet' | 'danger' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE =
    'inline-flex items-center justify-center font-condensed font-semibold tracking-wide rounded-sm ' +
    'cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-40 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-platform-900'

const VARIANTS: Record<ButtonVariant, string> = {
    solid: 'bg-chalk text-platform-900 hover:bg-white',
    quiet: 'bg-platform-600 text-chalk hover:bg-platform-500',
    danger: 'bg-danger text-white hover:brightness-110',
    outline: 'border border-platform-500 text-chalk hover:border-steel hover:bg-platform-800',
}

const SIZES: Record<ButtonSize, string> = {
    sm: 'text-[13px] px-3 py-2',
    md: 'text-[14px] px-4 py-3',
    lg: 'text-[16px] px-4 py-3.5',
}

/** Tailwind classes for a button-shaped element — for `<Link>` and anything that isn't a <button>. */
export function buttonClass(variant: ButtonVariant = 'solid', size: ButtonSize = 'md', extra = ''): string {
    return `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${extra}`.trim()
}
