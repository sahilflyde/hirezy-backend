import JoinOurTeam from '../models/joinOurTeamModel.js';
import imagekit from '../utils/imagekit.js';

// @desc    Start join our team form
// @route   POST /api/join-team/start
// @access  Public
export const startJoinTeamForm = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if form already exists for this email
    if (email) {
      let form = await JoinOurTeam.findOne({ 
        email, 
        isCompleted: false 
      }).sort({ createdAt: -1 });

      if (form) {
        return res.status(200).json({
          success: true,
          message: 'Existing form found',
          data: form,
        });
      }
    }

    // Create new form
    const formData = {
      currentStep: 1,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    };

    if (email) formData.email = email;

    const form = await JoinOurTeam.create(formData);

    res.status(201).json({
      success: true,
      message: 'Form started successfully',
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting form',
      error: error.message,
    });
  }
};

// @desc    Update Step 1 - Personal Details
// @route   PUT /api/join-team/:id/step1
// @access  Public
export const updateStep1 = async (req, res) => {
  try {
    const { name, email, phone, linkedinProfile, portfolioOrGithub, currentLocation, willingToRelocate } = req.body;

    const form = await JoinOurTeam.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    form.name = name;
    form.email = email;
    form.phone = phone;
    form.linkedinProfile = linkedinProfile;
    form.portfolioOrGithub = portfolioOrGithub;
    form.currentLocation = currentLocation;
    form.willingToRelocate = willingToRelocate;
    form.completeStep(1);
    await form.save();

    res.status(200).json({
      success: true,
      message: 'Step 1 completed',
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating step 1',
      error: error.message,
    });
  }
};

// @desc    Update Step 2 - Role & Skills
// @route   PUT /api/join-team/:id/step2
// @access  Public
export const updateStep2 = async (req, res) => {
  try {
    const { role, experience, skills } = req.body;

    const form = await JoinOurTeam.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    let resumeUrl = form.resumeUrl; // Keep existing resume URL if no new file

    // Upload resume to ImageKit if file is provided
    if (req.file) {
      try {
        console.log('📄 Uploading resume to ImageKit...');
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer.toString('base64'),
          fileName: `resume_${form.name ? form.name.replace(/\s+/g, '_') : 'applicant'}_${Date.now()}.pdf`,
          folder: '/gtw-resumes',
        });
        resumeUrl = uploadResponse.url;
        console.log('✅ Resume uploaded successfully:', resumeUrl);
      } catch (uploadError) {
        console.error('❌ Error uploading resume to ImageKit:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading resume',
          error: uploadError.message,
        });
      }
    }

    form.role = role;
    form.experience = experience;
    form.skills = Array.isArray(skills) ? skills : JSON.parse(skills || '[]');
    form.resumeUrl = resumeUrl;
    form.completeStep(2);
    await form.save();

    res.status(200).json({
      success: true,
      message: 'Step 2 completed',
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating step 2',
      error: error.message,
    });
  }
};

// @desc    Update Step 3 - Intent & Fit
// @route   PUT /api/join-team/:id/step3
// @access  Public
export const updateStep3 = async (req, res) => {
  try {
    const { whyJoinGTW, proudProject } = req.body;

    const form = await JoinOurTeam.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    form.whyJoinGTW = whyJoinGTW;
    form.proudProject = proudProject;
    form.completeStep(3);
    await form.save();

    res.status(200).json({
      success: true,
      message: 'Step 3 completed',
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating step 3',
      error: error.message,
    });
  }
};

// @desc    Update Step 4 - Availability
// @route   PUT /api/join-team/:id/step4
// @access  Public
export const updateStep4 = async (req, res) => {
  try {
    const { startTime, openToFreelance } = req.body;

    const form = await JoinOurTeam.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    form.startTime = startTime;
    form.openToFreelance = openToFreelance;
    form.completeStep(4);
    await form.save();

    res.status(200).json({
      success: true,
      message: 'Step 4 completed',
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating step 4',
      error: error.message,
    });
  }
};

// @desc    Update Step 5 - Final Step & Submit
// @route   PUT /api/join-team/:id/step5
// @access  Public
export const updateStep5 = async (req, res) => {
  try {
    const { agreedToTerms } = req.body;

    const form = await JoinOurTeam.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    form.agreedToTerms = agreedToTerms;
    form.completeStep(5);
    form.checkAllStepsCompleted();
    await form.save();

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message,
    });
  }
};

// @desc    Get form by ID
// @route   GET /api/join-team/:id
// @access  Public
export const getFormById = async (req, res) => {
  try {
    const form = await JoinOurTeam.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching form',
      error: error.message,
    });
  }
};

// @desc    Get all forms (with pagination)
// @route   GET /api/join-team
// @access  Public
export const getAllForms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {};
    if (req.query.isCompleted !== undefined) {
      filters.isCompleted = req.query.isCompleted === 'true';
    }
    if (req.query.role) {
      filters.role = req.query.role;
    }

    const forms = await JoinOurTeam.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await JoinOurTeam.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: forms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching forms',
      error: error.message,
    });
  }
};

// @desc    Delete form
// @route   DELETE /api/join-team/:id
// @access  Public
export const deleteForm = async (req, res) => {
  try {
    const form = await JoinOurTeam.findByIdAndDelete(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Form deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting form',
      error: error.message,
    });
  }
};
