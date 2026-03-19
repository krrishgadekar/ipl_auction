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
router.post('/sell-franchise', adminController.sellFranchise);

// Error Corrections
router.post('/correction/undo', adminController.undoPlayerAssignment);
router.post('/correction/price', adminController.correctPurchasePrice);
router.post('/correction/reassign', adminController.reassignPlayer);
router.post('/correction/purse', adminController.correctPurse);

// Audit
router.get('/audit-logs', adminController.getAuditLogs);

// Powercards (Bidding & Manual Marking)
router.post('/powercard/sell', adminController.sellPowercard);
router.post('/powercard/use', cardController.usePowercard); // Single endpoint for any card usage
router.post('/powercard/remove', adminController.deletePowercard);
router.post('/powercard/revert', cardController.revertPowercard);

// Right To Match (Simplified Manual Marking)
router.post('/rtm/use', rtmController.useRtm);
router.post('/rtm/revert', rtmController.revertRtm);

// Squad Overrides
router.post('/squad/override', squadController.overridePurchase);

// Final XI
router.get('/final-xi/submissions', finalXIController.getSubmissions);

// Results & Leaderboard
router.post('/compute-results', adminController.computeResults);
router.get('/leaderboard', adminController.getLeaderboard);

export default router;
