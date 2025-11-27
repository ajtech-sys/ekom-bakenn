import React from 'react'

const Root = ({ open, children }: { open: boolean; children: React.ReactNode }) => {
  if (!open) return null
  return <div className="fixed bottom-0 left-0 right-0 z-40 bg-base-200 border-t border-base-300">{children}</div>
}
const Bar = ({ children }: { children: React.ReactNode }) => {
  return <div className="container mx-auto flex items-center gap-4 p-3">{children}</div>
}
const Value = ({ children }: { children: React.ReactNode }) => {
  return <span className="text-sm">{children}</span>
}
const Seperator = () => <span className="h-4 w-px bg-base-300" />
const Command = ({ action, label, disabled }: { action: () => void; label: string; shortcut?: string; disabled?: boolean }) => {
  return (
    <button className="btn btn-sm btn-ghost" onClick={action} disabled={disabled}>
      {label}
    </button>
  )
}

export const CommandBar = Object.assign(Root, { Bar, Value, Seperator, Command })
