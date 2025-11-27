import React, { createContext, useContext } from 'react'

type RootProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const Ctx = createContext<{ open: boolean; onOpenChange: (o: boolean) => void } | null>(null)

const Root = ({ open, onOpenChange, children }: RootProps) => {
  return <Ctx.Provider value={{ open, onOpenChange }}>{children}</Ctx.Provider>
}

const Trigger = ({ children }: { children: React.ReactNode }) => {
  const ctx = useContext(Ctx)!
  return (
    <span onClick={() => ctx.onOpenChange(true)} role="button" className="inline-block">
      {children}
    </span>
  )
}

const Content = ({ children }: { children: React.ReactNode }) => {
  const ctx = useContext(Ctx)!
  if (!ctx.open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => ctx.onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-4xl rounded-lg bg-base-100 shadow-lg">
        {children}
      </div>
    </div>
  )
}

const Header = ({ children }: { children: React.ReactNode }) => {
  return <div className="border-b border-base-300 p-4">{children}</div>
}
const Body = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-4 ${className}`}>{children}</div>
}
const Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className="border-t border-base-300 p-4">{children}</div>
}

export const FocusModal = Object.assign(Root, { Trigger, Content, Header, Body, Footer })
