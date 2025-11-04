import AgencyPartnership from '../models/agencyPartnershipModel.js';
import imagekit from '../utils/imagekit.js';

// @desc    Start agency partnership form
// @route   POST /api/agency-partnership/start
// @access  Public
export const startAgencyPartnershipForm = async (req, res) => {
  try {
    const { agencyName } = req.body;

    // Check if form already exists for this agency
    if (agencyName) {
      let form = await AgencyPartnership.findOne({ 
        agencyName, 
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

    if (agencyName) formData.agencyName = agencyName;

    const form = await AgencyPartnership.create(formData);

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

// @desc    Update Step 1 - Agency Details
// @route   PUT /api/agency-partnership/:id/step1
// @access  Public
export const updateStep1 = async (req, res) => {
  try {
    const { agencyName, websiteUrl, socialMedia, location, teamSize } = req.body;

    const form = await AgencyPartnership.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    form.agencyName = agencyName;
    form.websiteUrl = websiteUrl;
    form.socialMedia = socialMedia;
    form.location = location;
    form.teamSize = teamSize;
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

// @desc    Update Step 2 - Partnership Fit
// @route   PUT /api/agency-partnership/:id/step2
// @access  Public
export const updateStep2 = async (req, res) => {
  try {
    const { specializations, whatNotDo, workedWithDevPartners, collaborationType } = req.body;

    const form = await AgencyPartnership.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    form.specializations = specializations;
    form.whatNotDo = whatNotDo;
    form.workedWithDevPartners = workedWithDevPartners;
    form.collaborationType = collaborationType;
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

// @desc    Update Step 3 - Project Examples
// @route   PUT /api/agency-partnership/:id/step3
// @access  Public
export const updateStep3 = async (req, res) => {
  try {
    const { recentProjects } = req.body;

    const form = await AgencyPartnership.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    let portfolioUrl = form.portfolioUrl; // Keep existing portfolio URL if no new file

    // Upload portfolio to ImageKit if file is provided
    if (req.file) {
      try {
        console.log('📄 Uploading portfolio to ImageKit...');
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer.toString('base64'),
          fileName: `portfolio_${form.agencyName ? form.agencyName.replace(/\s+/g, '_') : 'agency'}_${Date.now()}.pdf`,
          folder: '/gtw-portfolios',
        });
        portfolioUrl = uploadResponse.url;
        console.log('✅ Portfolio uploaded successfully:', portfolioUrl);
      } catch (uploadError) {
        console.error('❌ Error uploading portfolio to ImageKit:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Error uploading portfolio',
          error: uploadError.message,
        });
      }
    }

    form.recentProjects = recentProjects;
    form.portfolioUrl = portfolioUrl;
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

// @desc    Update Step 4 - Collaboration
// @route   PUT /api/agency-partnership/:id/step4
// @access  Public
export const updateStep4 = async (req, res) => {
  try {
    const { engagementModels, timeZone, howFoundUs } = req.body;

    const form = await AgencyPartnership.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    form.engagementModels = engagementModels;
    form.timeZone = timeZone;
    form.howFoundUs = howFoundUs;
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
// @route   PUT /api/agency-partnership/:id/step5
// @access  Public
export const updateStep5 = async (req, res) => {
  try {
    const { agreedToTerms } = req.body;

    const form = await AgencyPartnership.findById(req.params.id);

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
      message: 'Partnership application submitted successfully',
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
// @route   GET /api/agency-partnership/:id
// @access  Public
export const getFormById = async (req, res) => {
  try {
    const form = await AgencyPartnership.findById(req.params.id);

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
// @route   GET /api/agency-partnership
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
    if (req.query.teamSize) {
      filters.teamSize = req.query.teamSize;
    }

    const forms = await AgencyPartnership.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AgencyPartnership.countDocuments(filters);

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
// @route   DELETE /api/agency-partnership/:id
// @access  Public
export const deleteForm = async (req, res) => {
  try {
    const form = await AgencyPartnership.findByIdAndDelete(req.params.id);

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
