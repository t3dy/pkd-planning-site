import { createServer } from 'vite'

const server = await createServer({
  root: import.meta.dirname,
  server: { port: 5175 },
})

await server.listen()
server.printUrls()
