import GetStartedForm from '../models/getStartedFormModel.js';

// @desc    Create or get existing form
// @route   POST /api/form/start
// @access  Public
export const startForm = async (req, res) => {
  try {
    const { email, projectType, name } = req.body;

    // For step 1: only projectType is required
    if (!projectType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project type is required' 
      });
    }

    // Check if form already exists (if email is provided)
    if (email) {
      let form = await GetStartedForm.findOne({ 
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

    // Create new form with available data
    const formData = {
      projectType,
      currentStep: 1,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    };

    // Add optional fields if provided
    if (name) formData.name = name;
    if (email) formData.email = email;

    const form = await GetStartedForm.create(formData);

    // Mark step 1 as completed
    form.completeStep(1);
    await form.save();

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

// @desc    Update Step 1 - Project Type
// @route   PUT /api/form/:id/step1
// @access  Public
export const updateStep1 = async (req, res) => {
  try {
    const { projectType } = req.body;

    const form = await GetStartedForm.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    form.projectType = projectType;
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

// @desc    Update Step 2 - Project Overview
// @route   PUT /api/form/:id/step2
// @access  Public
export const updateStep2 = async (req, res) => {
  try {
    const { name, email, companyName, companyType, startTime } = req.body;

    const form = await GetStartedForm.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    form.name = name;
    form.email = email;
    form.companyName = companyName;
    form.companyType = companyType;
    form.startTime = startTime;
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

// @desc    Update Step 3 - Track-Specific Questions
// @route   PUT /api/form/:id/step3
// @access  Public
export const updateStep3 = async (req, res) => {
  try {
    const trackSpecificData = req.body;

    const form = await GetStartedForm.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    // Update track-specific answers based on project type
    form.trackSpecificAnswers = {
      ...form.trackSpecificAnswers,
      ...trackSpecificData,
    };
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

// @desc    Update Step 4 - Budget & Scope
// @route   PUT /api/form/:id/step4
// @access  Public
export const updateStep4 = async (req, res) => {
  try {
    const { budgetRange, postLaunchSupport, documents } = req.body;

    const form = await GetStartedForm.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    form.budgetRange = budgetRange;
    form.postLaunchSupport = postLaunchSupport;
    form.documents = documents;
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

// @desc    Update Step 5 - Final Notes & Submit
// @route   PUT /api/form/:id/step5
// @access  Public
export const updateStep5 = async (req, res) => {
  try {
    const { additionalNotes } = req.body;

    const form = await GetStartedForm.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ 
        success: false, 
        message: 'Form not found' 
      });
    }

    form.additionalNotes = additionalNotes;
    form.completeStep(5);
    form.checkAllStepsCompleted();
    await form.save();

    res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      data: form,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message,
    });
  }
};

// @desc    Get form by ID
// @route   GET /api/form/:id
// @access  Public
export const getFormById = async (req, res) => {
  try {
    const form = await GetStartedForm.findById(req.params.id);

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
// @route   GET /api/form
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
    if (req.query.projectType) {
      filters.projectType = req.query.projectType;
    }

    const forms = await GetStartedForm.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await GetStartedForm.countDocuments(filters);

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
// @route   DELETE /api/form/:id
// @access  Public
export const deleteForm = async (req, res) => {
  try {
    const form = await GetStartedForm.findByIdAndDelete(req.params.id);

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
