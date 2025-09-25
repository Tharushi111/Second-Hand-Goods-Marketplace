import mongoose from 'mongoose';

const supplierOfferSchema = new mongoose.Schema({
  supplierId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Supplier ID is required'] 
  },
  title: { 
    type: String, 
    required: [true, 'Offer title is required'], 
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'Offer description is required'], 
    trim: true 
  },
  pricePerUnit: { 
    type: Number, 
    required: [true, 'Price per unit is required'], 
    min: [0, 'Price cannot be negative'] 
  },
  quantityOffered: { 
    type: Number, 
    required: [true, 'Quantity is required'], 
    min: [1, 'Quantity must be at least 1'] 
  },
  deliveryDate: { 
    type: Date, 
    validate: {
      validator: function(value) {
        return !value || value >= new Date();
      },
      message: 'Delivery date cannot be in the past'
    }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  decisionBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin' 
  },
  decisionAt: { 
    type: Date 
  }
}, { timestamps: true });

export default mongoose.model('SupplierOffer', supplierOfferSchema);
