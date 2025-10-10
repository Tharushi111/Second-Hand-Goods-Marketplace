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

/* Add a reply to a reorder request */
export const addReply = async (req, res) => {
  try {
    const { reply } = req.body;
    if (!reply || reply.trim() === "") {
      return res.status(400).json({ message: "Reply cannot be empty" });
    }

    const reorderRequest = await ReorderRequest.findById(req.params.id);
    if (!reorderRequest) {
      return res.status(404).json({ message: "Reorder request not found" });
    }

    reorderRequest.replies.push({
      supplierId: req.user.id,
      reply: reply.trim()
    });

    await reorderRequest.save();
    res.status(200).json({ message: "Reply added successfully", replies: reorderRequest.replies });
  } catch (err) {
    res.status(500).json({ message: "Failed to add reply", error: err.message });
  }
};



// Get all replies for admin
export const getAllReplies = async (req, res) => {
  try {
    // Fetch all reorder requests that have replies
    const requestsWithReplies = await ReorderRequest.find({ "replies.0": { $exists: true } })
      .populate("replies.supplierId", "username email company") // populate supplier info
      .sort({ createdAt: -1 });

    // Flatten the replies so frontend can display them easily
    const allReplies = [];
    requestsWithReplies.forEach((request) => {
      request.replies.forEach((reply) => {
        allReplies.push({
          reorderRequestId: request._id,
          reorderTitle: request.title,
          supplierId: reply.supplierId._id,
          supplierName: reply.supplierId.username,
          supplierEmail: reply.supplierId.email,
          supplierCompany: reply.supplierId.company,
          reply: reply.reply,
          repliedAt: reply.createdAt,
        });
      });
    });

    res.json({ replies: allReplies });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch replies", error: err.message });
  }
};

