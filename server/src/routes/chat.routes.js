/**
 * chat.routes.js
 *
 * Registers POST /api/chat.
 * Uses optionalAuthenticate so both guests and logged-in users can access it.
 * The apiLimiter from app.js already covers this route (applied globally to /api).
 */

import { Router } from 'express';
import { handleChat } from '../controllers/chat.controller.js';
import { optionalAuthenticate } from '../middleware/optionalAuthenticate.js';

export const chatRoutes = Router();

chatRoutes.post('/', optionalAuthenticate, handleChat);
