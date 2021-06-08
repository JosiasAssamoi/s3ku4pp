import { Router } from 'express'

import checkJwt from '../middlewares/jwt'
/* API Routes */
import auth from './auth'

const router = Router()

router.use('/auth', auth)
// router.use('/users', checkJwt(), user)

export default router