import 'source-map-support/register'

export function initInstrumentation(): void {
  process.on('unhandledRejection', (reason) => {
    console.error('UnhandledRejection', reason)
  })
  process.on('uncaughtException', (err) => {
    console.error('UncaughtException', err)
  })
}
