import React from 'react'

type Props = React.HTMLAttributes<HTMLParagraphElement>

export const Text = ({ children, className, ...rest }: Props) => {
  return (
    <p className={className} {...rest}>
      {children}
    </p>
  )
}
