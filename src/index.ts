import { Hono } from "hono"
import { cors } from "hono/cors"

export type Status = "todo" | "inprogress" | "done"

export type Work = {
  id: string
  title: string
  status: Status
  createdAt: string
}

/* ------------ SERVER MEMORY ------------ */
let works: Work[] = [{
  "id": "1",
  "title": "Setup project structure",
  "status": "done",
  "createdAt": "2026-01-30T..."
},
{
  "id": "2",
  "title": "Create API endpoints",
  "status": "inprogress",
  "createdAt": "2026-01-30T..."
},
{
  "id": "3",
  "title": "Add frontend interface",
  "status": "todo",
  "createdAt": "2026-01-30T..."
}]

const app = new Hono()

app.use(cors({
  origin:["http://localhost:5173"],
  allowMethods:["GET", "POST", "PUT", "DELETE"],
  allowHeaders: ['Content-Type'],
  credentials: true,
}))

/* -------- GET ALL WORKS -------- */
app.get("/", (c) => {
  return c.json(works)
})

/* -------- ADD WORK -------- */
app.post("/add", async (c) => {
  const { title, status } = await c.req.json()

  if (!title || !status) {
    return c.json({ message: "Invalid data" }, 400)
  }

  const work: Work = {
    id: crypto.randomUUID(),
    title,
    status,
    createdAt: new Date().toISOString(),
  }

  works.push(work)
  return c.json(work, 201)
})

/* -------- UPDATE WORK -------- */
app.patch("/update/:id", async (c) => {
  const id = c.req.param("id")
  const updates = await c.req.json()

  const work = works.find((w) => w.id === id)
  if (!work) return c.json({ message: "Not found" }, 404)

  Object.assign(work, updates)
  return c.json(work)
})

/* -------- DELETE WORK -------- */
app.delete("delete/:id", (c) => {
  const id = c.req.param("id")
  works = works.filter((w) => w.id !== id)
  return c.body(null, 204)
})

export default app
