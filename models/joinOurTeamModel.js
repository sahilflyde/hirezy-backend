import mongoose from 'mongoose';

const joinOurTeamSchema = new mongoose.Schema(
  {
    // Step 1 - Personal Details
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
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    linkedinProfile: {
      type: String,
      trim: true,
    },
    portfolioOrGithub: {
      type: String,
      trim: true,
    },
    currentLocation: {
      type: String,
      trim: true,
    },
    willingToRelocate: {
      type: String,
      enum: ['Yes', 'No', '', 'yes','no','YeS','NO','YES','yEs','YEs','yES','nO'],
    },

    // Step 2 - Role & Skills
    role: {
      type: String,
      enum: ['Backend', 'Native', 'UI/UX', 'Executive', 'Manager', 'Frontend', 'Junior', 'Intern', 'Other', ''],
    },
    experience: {
      type: String,
      enum: ['0–1', '1–3', '3–5', '5+', ''],
    },
    skills: {
      type: [String],
      default: [],
    },
    resumeUrl: {
      type: String,
      trim: true,
    },

    // Step 3 - Intent & Fit
    whyJoinGTW: {
      type: String,
      trim: true,
    },
    proudProject: {
      type: String,
      trim: true,
    },

    // Step 4 - Availability
    startTime: {
      type: String,
      enum: ['Within a week', 'Within a month', 'Later', ''],
    },
    openToFreelance: {
      type: String,
      enum: ['Yes', 'No', ''],
    },

    // Step 5 - Final Step
    agreedToTerms: {
      type: Boolean,
      default: false,
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
    timestamps: true,
  }
);

// Index for faster queries
joinOurTeamSchema.index({ email: 1 });
joinOurTeamSchema.index({ createdAt: -1 });
joinOurTeamSchema.index({ isCompleted: 1 });

// Method to mark step as completed
joinOurTeamSchema.methods.completeStep = function (stepNumber) {
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
joinOurTeamSchema.methods.checkAllStepsCompleted = function () {
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

const JoinOurTeam = mongoose.model('JoinOurTeam', joinOurTeamSchema);

export default JoinOurTeam;
