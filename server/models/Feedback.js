const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 8000,
    },
    images: {
      type: [String],
      default: [],
    },
    name: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
