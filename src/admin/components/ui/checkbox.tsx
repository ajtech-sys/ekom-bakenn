import React from 'react'

type Props = {
  checked: boolean
  onCheckedChange: () => void
}

export const Checkbox = ({ checked, onCheckedChange }: Props) => {
  return <input type="checkbox" className="checkbox checkbox-primary" checked={checked} onChange={onCheckedChange} />
}
