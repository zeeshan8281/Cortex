import 'dotenv/config'
import express from 'express'

const app = express()

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/', (_req, res) => {
  res.send('CORTEX')
})

const PORT = parseInt(process.env.PORT || '3000', 10)
app.listen(PORT, () => {
  console.log(`CORTEX running on port ${PORT}`)
})
