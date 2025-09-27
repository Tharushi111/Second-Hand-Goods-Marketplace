import ReorderRequest from "../models/ReorderRequest.js";

/* Create a new Reorder Request */
export const createReorderRequest = async (req, res) => {
  try {
    // Ensure quantity is a number
    const requestData = {
      ...req.body,
      quantity: Number(req.body.quantity),
    };

    const newRequest = new ReorderRequest(requestData);
    await newRequest.save();

    // Return created document
    res.status(201).json({
      message: "Reorder request created successfully",
      request: newRequest,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: "Failed to create reorder request" });
  }
};

/* Get all Reorder Requests */
export const getAllReorderRequests = async (req, res) => {
  try {
    const requests = await ReorderRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reorder requests" });
  }
};

/* Get a single Reorder Request by ID */
export const getReorderRequestById = async (req, res) => {
  try {
    const request = await ReorderRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Reorder request not found" });
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reorder request" });
  }
};

/* Update a Reorder Request by ID */
export const updateReorderRequest = async (req, res) => {
  try {
    // Ensure quantity is a number
    const updateData = {
      ...req.body,
      quantity: Number(req.body.quantity),
    };

    const updatedRequest = await ReorderRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ error: "Reorder request not found" });
    }

    // Return updated document
    res.json({
      message: "Reorder request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: "Failed to update reorder request" });
  }
};

/* Delete a Reorder Request by ID */
export const deleteReorderRequest = async (req, res) => {
  try {
    const deletedRequest = await ReorderRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ error: "Reorder request not found" });
    }
    res.json({ message: "Reorder request deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reorder request" });
  }
};
