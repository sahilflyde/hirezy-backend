import mongoose from 'mongoose';

const agencyPartnershipSchema = new mongoose.Schema(
  {
    agencyName: {
      type: String,
      required: false,
      trim: true,
    },
    websiteUrl: {
      type: String,
      trim: true,
    },
    socialMedia: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    teamSize: {
      type: String,
      enum: ['1', '2–5', '5–15', '15+', ''],
    },
    specializations: {
      type: [String],
      default: [],
    },
    whatNotDo: {
      type: String,
      trim: true,
    },
    workedWithDevPartners: {
      type: String,
      enum: ['Yes', 'No', '', 'yes','no','YeS','NO','YES','yEs','YEs','yES','nO'],
    },
    collaborationType: {
      type: String,
      trim: true,
    },

    // Step 3 - Project Examples
    recentProjects: {
      type: String,
      trim: true,
    },
    portfolioUrl: {
      type: String,
      trim: true,
    },
    engagementModels: {
      type: [String],
      default: [],
    },
    timeZone: {
      type: String,
      trim: true,
    },
    howFoundUs: {
      type: String,
      enum: ['Instagram', 'Referral', 'Behance', 'Web', 'Other', ''],
    },

    agreedToTerms: {
      type: Boolean,
      default: false,
    },
    currentStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    completedSteps: {
      type: [Number],
      default: [],
    },
    stepCompletionStatus: {
      step1: { type: Boolean, default: false },
      step2: { type: Boolean, default: false },
      step3: { type: Boolean, default: false },
      step4: { type: Boolean, default: false },
      step5: { type: Boolean, default: false },
    },

    // Submission Status
    isCompleted: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
    },

    // Metadata
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

agencyPartnershipSchema.index({ agencyName: 1 });
agencyPartnershipSchema.index({ createdAt: -1 });
agencyPartnershipSchema.index({ isCompleted: 1 });

agencyPartnershipSchema.methods.completeStep = function (stepNumber) {
  if (stepNumber >= 1 && stepNumber <= 5) {
    this.stepCompletionStatus[`step${stepNumber}`] = true;
    if (!this.completedSteps.includes(stepNumber)) {
      this.completedSteps.push(stepNumber);
    }
    this.currentStep = Math.min(stepNumber + 1, 5);
  }
  return this;
};

// Method to check if all steps are completed
agencyPartnershipSchema.methods.checkAllStepsCompleted = function () {
  const allCompleted = 
    this.stepCompletionStatus.step1 &&
    this.stepCompletionStatus.step2 &&
    this.stepCompletionStatus.step3 &&
    this.stepCompletionStatus.step4 &&
    this.stepCompletionStatus.step5;
  
  if (allCompleted && !this.isCompleted) {
    this.isCompleted = true;
    this.submittedAt = new Date();
  }
  
  return allCompleted;
};

const AgencyPartnership = mongoose.model('AgencyPartnership', agencyPartnershipSchema);

export default AgencyPartnership;
