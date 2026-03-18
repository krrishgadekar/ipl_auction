import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import cardController from '../controllers/cardController.js';
import rtmController from '../controllers/rtmController.js';
import squadController from '../controllers/squadController.js';
import finalXIController from '../controllers/finalXIController.js';

const router = Router();

// Standard Auction Flow
router.post('/state', adminController.changeState);
router.post('/next-player', adminController.introduceNextPlayer);
router.post('/sell-player', adminController.sellPlayer);
router.post('/unsold-player', adminController.markPlayerUnsold);
router.post('/release-player', adminController.releasePlayer);

// Error Corrections
router.post('/correction/undo', adminController.undoPlayerAssignment);
router.post('/correction/price', adminController.correctPurchasePrice);
router.post('/correction/reassign', adminController.reassignPlayer);
router.post('/correction/purse', adminController.correctPurse);
router.post('/correction/revert-card', adminController.revertPowercard);

// Audit
router.get('/audit-logs', adminController.getAuditLogs);

// Powercards
router.post('/powercard/buy', cardController.grantPowercard);
router.post('/powercard/use/gods-eye', cardController.useGodsEye);
router.post('/powercard/use/mulligan', cardController.useMulligan);
router.post('/powercard/use/final-strike', cardController.useFinalStrike);
router.post('/powercard/use/bid-freezer', cardController.useBidFreezer);

// Right To Match
router.post('/use-rtm', rtmController.useRtm);

// Squad Overrides
router.post('/squad/override', squadController.overridePurchase);

// Final XI
router.get('/final-xi/submissions', finalXIController.getSubmissions);

// Results & Leaderboard
router.post('/compute-results', adminController.computeResults);
router.get('/leaderboard', adminController.getLeaderboard);

export default router;
