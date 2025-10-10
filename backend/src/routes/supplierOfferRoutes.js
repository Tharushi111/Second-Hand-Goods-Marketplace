import express from 'express';
import {
  createOffer,
  updateOffer,
  deleteOffer,
  getAllOffers,
  getAllOffersForSupplier,
  approveOffer,
  rejectOffer
} from '../controllers/supplierOfferController.js';

import { verifyToken, requireRole } from '../middleware/auth.js';
import { verifyAdminToken, requireAdminRole } from '../middleware/adminAuth.js';

const router = express.Router();

// Supplier routes
router.post('/', verifyToken, requireRole('supplier'), createOffer);
router.put('/:id', verifyToken, requireRole('supplier'), updateOffer);
router.delete('/:id', verifyToken, requireRole('supplier'), deleteOffer);
router.get("/my-offers", verifyToken, requireRole("supplier"), getAllOffersForSupplier);

// Admin routes
router.get('/', verifyAdminToken, getAllOffers);
router.patch('/:id/approve', verifyAdminToken, requireAdminRole('admin', 'super_admin'), approveOffer);
router.patch('/:id/reject', verifyAdminToken, requireAdminRole('admin', 'super_admin'), rejectOffer);



export default router;
