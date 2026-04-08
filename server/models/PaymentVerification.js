const mongoose = require('mongoose');

const paymentVerificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    consumed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentVerification = mongoose.model('PaymentVerification', paymentVerificationSchema);

module.exports = PaymentVerification;
