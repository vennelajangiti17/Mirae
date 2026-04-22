// routes/jobRoutes.js
// ⚠️ DEPRECATED: This route is kept for backward compatibility only.
// All new job saving should go through /api/tracker which has proper auth,
// dynamic resume fetching, and graceful AI fallback.
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.status(410).json({
    error: 'This endpoint is deprecated. Please use POST /api/tracker instead.',
    redirect: '/api/tracker'
  });
});

module.exports = router;

