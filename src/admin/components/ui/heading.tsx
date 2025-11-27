import React from 'react'

type Props = React.HTMLAttributes<HTMLHeadingElement>

export const Heading = ({ children, className, ...rest }: Props) => {
  return (
    <h2 className={`text-xl font-semibold ${className || ''}`} {...rest}>
      {children}
    </h2>
  )
}
