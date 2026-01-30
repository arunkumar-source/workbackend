import { Hono } from "hono"
import { cors } from "hono/cors"
import { handle } from "hono/vercel";

interface Work {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

const app = new Hono()
app.options('*', (c) => {
  return c.body(null, 204)
})


// Initialize works array to store work items
let works: Work[] = []

app.use('*', cors({
  origin: ['*','https://work-project-gamma.vercel.app/'], 
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

app.get("/", (c) => c.json(works))

app.post("/add", async (c) => {
  const { title, status } = await c.req.json()
  if (!title || !status) return c.json({ message: "Invalid data" }, 400)

  const work = {
    id: crypto.randomUUID(),
    title,
    status,
    createdAt: new Date().toISOString(),
  }

  works.push(work)
  return c.json(work, 201)
})

app.patch("/update/:id", async (c) => {
  const id = c.req.param("id")
  const updates = await c.req.json()

  const work = works.find(w => w.id === id)
  if (!work) return c.json({ message: "Not found" }, 404)

  Object.assign(work, updates)
  return c.json(work)
})

app.delete("/delete/:id", (c) => {
  const id = c.req.param("id")
  works = works.filter(w => w.id !== id)
  return c.body(null, 204)
})

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
export const OPTIONS = handle(app)
