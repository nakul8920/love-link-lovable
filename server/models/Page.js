const mongoose = require('mongoose');

const pageSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    customUrlData: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: Object, // Can store flexible page configuration like theme, names, messages 
      required: true,
      default: {}
    },
    images: {
      type: [String], // Array of image URLs
      default: []
    }
  },
  {
    timestamps: true,
  }
);

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
