
const User = require("../models/User");
const Organization = require("../models/Organization");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate a unique organization code
const generateOrganizationCode = async () => {
  let code;
  let existingOrganization;

  do {
    code = "STK-" + crypto.randomBytes(3).toString("hex").toUpperCase();

    existingOrganization = await Organization.findOne({
      organizationCode: code
    });
  } while (existingOrganization);

  return code;
};

// Generate JWT Token
const generateToken = (user, organizationId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      userId: user._id,
      organizationId,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// ==============================
// REGISTER ADMIN
// ==============================
const register = async (req, res) => {
  let organization;

  try {
    const { name, email, password, organizationName } = req.body;

    if (!name || !email || !password || !organizationName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOrganization = organizationName.trim();

    if (!normalizedEmail || !normalizedOrganization || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Fields cannot contain only spaces"
      });
    }

    // Check existing email
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Check existing organization
    const existingOrganization = await Organization.findOne({
      name: normalizedOrganization
    });

    if (existingOrganization) {
      return res.status(409).json({
        success: false,
        message: "Organization name already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate unique organization code
    const organizationCode = await generateOrganizationCode();

    // Create organization
    organization = await Organization.create({
      name: normalizedOrganization,
      organizationCode
    });

    // First user becomes admin
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      organizationName: organization.name,
      organizationId: organization._id,
      role: "admin"
    });

    // Connect organization with creator
    organization.createdBy = user._id;
    await organization.save();

    const token = generateToken(user, organization._id);

    return res.status(201).json({
      success: true,
      message: "Admin registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: user.organizationName,
        organizationCode: organization.organizationCode
      },
      organization: {
        id: organization._id,
        name: organization.name,
        organizationCode: organization.organizationCode
      }
    });

  } catch (error) {
    // Clean up organization if registration fails
    if (organization) {
      try {
        await Organization.findByIdAndDelete(organization._id);
      } catch (cleanupError) {
        console.error("Organization cleanup failed:", cleanupError.message);
      }
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
};

// ==============================
// LOGIN
// ==============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user, user.organizationId);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationName: user.organizationName
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

module.exports = {
  register,
  login
};
