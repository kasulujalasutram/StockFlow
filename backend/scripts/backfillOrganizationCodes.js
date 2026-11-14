
require("dotenv").config();

const mongoose = require("mongoose");
const crypto = require("crypto");
const Organization = require("../models/Organization");

async function generateUniqueCode() {
  let code;
  let exists;

  do {
    code = "STK-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    exists = await Organization.findOne({ organizationCode: code });
  } while (exists);

  return code;
}

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const organizations = await Organization.find({
      $or: [
        { organizationCode: { $exists: false } },
        { organizationCode: null },
        { organizationCode: "" }
      ]
    });

    for (const organization of organizations) {
      organization.organizationCode = await generateUniqueCode();
      await organization.save();

      console.log(
        `${organization.name}: ${organization.organizationCode}`
      );
    }

    console.log("Organization code migration completed.");
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
