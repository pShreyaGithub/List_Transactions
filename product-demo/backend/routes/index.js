const express = require("express");
const { transaction } = require("../controllers/transaction");
const {
  stats,
  priceStats,
  categoryStats,
  combinedStats,
} = require("../controllers/statistics");
const router = express.Router();

router.use("/transactions", transaction);
router.use("/stats", stats);
router.use("/priceStats", priceStats);
router.use("/categoryStats", categoryStats);
router.use("/combinedStats", combinedStats);

module.exports = router;
