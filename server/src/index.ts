import express, { Request, Response } from 'express'
import cors from 'cors'
import cronRoutes from './routes/cron.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.use('/api/cron', cronRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})