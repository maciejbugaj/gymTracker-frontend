import type { ButtonHTMLAttributes } from 'react'
import { buttonClass, type ButtonSize, type ButtonVariant } from './buttonClass'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
}

export default function Button({ variant = 'solid', size = 'md', className = '', type = 'button', ...rest }: ButtonProps) {
    return <button type={type} className={buttonClass(variant, size, className)} {...rest} />
}
