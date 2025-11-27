import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
}

export const Button = ({ size = 'medium', variant = 'primary', isLoading, className, children, ...rest }: Props) => {
  const sizeCls = size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : ''
  const variantCls = variant === 'secondary' ? 'btn-secondary' : 'btn-primary'
  return (
    <button className={`btn ${variantCls} ${sizeCls} ${className || ''}`} {...rest} disabled={isLoading || rest.disabled}>
      {isLoading ? 'Loading...' : children}
    </button>
  )
}
