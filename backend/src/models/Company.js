const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      default: "https://via.placeholder.com/100",
    },
    website: {
      type: String,
      default: "https://example.com",
    },
    industry: {
      type: String,
      default: "Information Technology",
    },
    tier: {
      type: String,
      enum: ["Tier-1", "Tier-2", "Tier-3", "Dream", "Super Dream"],
      default: "Dream",
    },
    typicalPackageLPA: {
      min: { type: Number, default: 8 },
      max: { type: Number, default: 18 },
    },
    location: {
      type: String,
      default: "Bangalore, India",
    },
    description: {
      type: String,
      default: "",
    },
    requiredTechStack: [String],
    cultureScore: {
      type: Number,
      default: 4.5,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
