import express, { Request, Response } from 'express'
import cors from 'cors'
import cronRoutes from '../server/src/routes/cron'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

app.use('/api/cron', cronRoutes)

export default app
