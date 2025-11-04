import mongoose from 'mongoose';

const getStartedFormSchema = new mongoose.Schema(
  {
    // Step 1 - Project Type Selection
    projectType: {
      type: String,
      enum: ['Web', 'Mobile', 'SaaS', 'Infra', 'Consult'],
      required: true,
    },

    // Step 2 - Project Overview
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    companyType: {
      type: String,
      enum: ['Startup', 'SME', 'Large Enterprise', 'Individual Founder'],
    },
    startTime: {
      type: String,
      enum: ['Immediately', 'Within 30 days', 'In 1–3 months', 'Just exploring'],
    },

    // Step 3 - Track-Specific Questions (varies by project type)
    trackSpecificAnswers: {
      // For Web
      siteType: {
        type: String,
        enum: ['Marketing site', 'Portfolio', 'Startup launch', 'Brand storytelling'],
      },
      brandDesignStatus: {
        type: String,
        enum: ['Yes', 'Partial', 'No'],
      },
      admiredSites: {
        type: String,
      },
      // For Mobile
      platformType: String,
      appFeatures: String,
      // For SaaS
      saasType: String,
      targetUsers: String,
      // For Infra
      infraType: String,
      scalingNeeds: String,
      // For Consult
      consultArea: String,
      currentChallenges: String,
    },

    // Step 4 - Budget & Scope
    budgetRange: {
      type: String,
      enum: ['Under ₹50k', '₹50k – ₹1L', '₹1L – ₹5L', '₹5L+'],
    },
    postLaunchSupport: {
      type: String,
      enum: ['Yes, ongoing retainer', 'Only initial build'],
    },
    documents: {
      type: String, // URL or file path
    },

    // Step 5 - Final Notes
    additionalNotes: {
      type: String,
    },

    // Step Tracking
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
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for faster queries
getStartedFormSchema.index({ email: 1 });
getStartedFormSchema.index({ createdAt: -1 });
getStartedFormSchema.index({ isCompleted: 1 });

// Method to mark step as completed
getStartedFormSchema.methods.completeStep = function (stepNumber) {
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
getStartedFormSchema.methods.checkAllStepsCompleted = function () {
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

const GetStartedForm = mongoose.model('GetStartedForm', getStartedFormSchema);

export default GetStartedForm;
