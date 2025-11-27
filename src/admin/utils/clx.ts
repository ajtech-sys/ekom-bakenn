export function clx(...args: Array<string | false | null | undefined>): string {
  return args.filter(Boolean).join(' ')
}
