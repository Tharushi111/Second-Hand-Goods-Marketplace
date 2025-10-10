import SupplierOffer from "../models/SupplierOffer.js";

// =====================
// Supplier Routes
// =====================

// Create a new offer
export const createOffer = async (req, res) => {
  try {
    if (req.user.role !== "supplier") {
      return res.status(403).json({ message: "Only suppliers can create offers." });
    }

    const { title, description, pricePerUnit, quantityOffered, deliveryDate } = req.body;

    // Validation
    if (!title || !description || pricePerUnit === undefined || quantityOffered === undefined) {
      return res.status(400).json({ message: "Title, description, price, and quantity are required." });
    }
    if (pricePerUnit < 0 || quantityOffered < 1) {
      return res.status(400).json({ message: "Price must be ≥ 0 and quantity ≥ 1." });
    }
    if (deliveryDate && new Date(deliveryDate) < new Date()) {
      return res.status(400).json({ message: "Delivery date cannot be in the past." });
    }

    const offer = await SupplierOffer.create({
      supplierId: req.user.id,
      title,
      description,
      pricePerUnit,
      quantityOffered,
      deliveryDate,
      status: "Pending",
    });

    res.status(201).json({ message: "Offer created successfully", offer });
  } catch (err) {
    res.status(500).json({ message: "Error creating offer", error: err.message });
  }
};

// Update an offer (only pending)
export const updateOffer = async (req, res) => {
  try {
    const offer = await SupplierOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    if (offer.supplierId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });
    if (offer.status !== "Pending")
      return res.status(400).json({ message: "Cannot edit non-pending offer" });

    const { title, description, pricePerUnit, quantityOffered, deliveryDate } = req.body;

    if (pricePerUnit !== undefined && pricePerUnit < 0)
      return res.status(400).json({ message: "Price must be ≥ 0" });
    if (quantityOffered !== undefined && quantityOffered < 1)
      return res.status(400).json({ message: "Quantity must be ≥ 1" });
    if (deliveryDate && new Date(deliveryDate) < new Date())
      return res.status(400).json({ message: "Delivery date cannot be in the past." });

    Object.assign(offer, { title, description, pricePerUnit, quantityOffered, deliveryDate });
    await offer.save();

    res.json({ message: "Offer updated successfully", offer });
  } catch (err) {
    res.status(500).json({ message: "Error updating offer", error: err.message });
  }
};

// Delete an offer (only pending)
export const deleteOffer = async (req, res) => {
  try {
    const offer = await SupplierOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    if (offer.supplierId.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });
    if (offer.status !== "Pending")
      return res.status(400).json({ message: "Cannot delete non-pending offer" });

    await offer.deleteOne();
    res.json({ message: "Offer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting offer", error: err.message });
  }
};

// Get all offers for the logged-in supplier
export const getAllOffersForSupplier = async (req, res) => {
  try {
    const offers = await SupplierOffer.find({ supplierId: req.user.id }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching offers", error: err.message });
  }
};

// =====================
// Admin Routes
// =====================

// List all offers (with optional filters)
export const getAllOffers = async (req, res) => {
  try {
    const { status, supplierId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (supplierId) filter.supplierId = supplierId;

    const offers = await SupplierOffer.find(filter)
      .populate("supplierId", "username email company phone")
      .populate("decisionBy", "username email role") // Admin info
      .sort({ createdAt: -1 });

    res.json({ offers });
  } catch (err) {
    res.status(500).json({ message: "Error fetching offers", error: err.message });
  }
};

// Approve offer
export const approveOffer = async (req, res) => {
  try {
    const offer = await SupplierOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    offer.status = "Approved";
    offer.decisionBy = req.user.id;
    offer.decisionAt = new Date();
    await offer.save();

    res.json({ message: "Offer approved", offer });
  } catch (err) {
    res.status(500).json({ message: "Error approving offer", error: err.message });
  }
};

// Reject offer
export const rejectOffer = async (req, res) => {
  try {
    const offer = await SupplierOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Offer not found" });

    offer.status = "Rejected";
    offer.decisionBy = req.user.id;
    offer.decisionAt = new Date();
    await offer.save();

    res.json({ message: "Offer rejected", offer });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting offer", error: err.message });
  }
};

