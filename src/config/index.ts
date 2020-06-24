import { config } from 'dotenv'

config()

export const PORT = parseInt((process.env.PORT || 4000).toString())

