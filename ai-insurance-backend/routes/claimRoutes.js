const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const {
  createClaim,
  getMyClaims,
  updateClaim,
  deleteClaim,
  autoClaim
} = require('../controllers/claimController');

// Primary CRUD routes
router.post('/', authMiddleware, createClaim);
router.get('/', authMiddleware, getMyClaims);
router.put('/:id', authMiddleware, updateClaim);
router.delete('/:id', authMiddleware, deleteClaim);

// Backward-compatible aliases used by older frontend code
router.post('/create', authMiddleware, createClaim);
router.get('/my', authMiddleware, getMyClaims);

router.get('/auto', authMiddleware, autoClaim);

module.exports = router;