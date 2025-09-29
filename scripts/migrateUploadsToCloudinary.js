require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const cloudinary = require("../config/cloudinary");

const BlogPost = require("../models/BlogPost");
const User = require("../models/User");
const About = require("../models/About");

function extractFilenameFromUploadsUrl(url) {
  try {
    const u = new URL(url);
    const segments = u.pathname.split("/");
    return segments[segments.length - 1];
  } catch (e) {
    return null;
  }
}

async function migrateField(Model, fieldName, query = {}) {
  const regex = /\/uploads\//i;
  const filter = { [fieldName]: { $regex: regex } };
  const docs = await Model.find({ ...query, ...filter });
  console.log(
    `\n[${Model.modelName}] Found ${docs.length} documents to migrate for field '${fieldName}'.`
  );
  let successCount = 0;
  let failCount = 0;

  for (const doc of docs) {
    const originalUrl = doc[fieldName];
    if (!originalUrl) continue;
    const filename =
      extractFilenameFromUploadsUrl(originalUrl) ||
      `${Model.modelName.toLowerCase()}_${doc._id}`;
    const publicIdBase = filename.replace(/\.[^.]+$/, "");

    try {
      const result = await cloudinary.uploader.upload(originalUrl, {
        folder: "psikolog-derya-arslan/migrated",
        public_id: `${Model.modelName.toLowerCase()}_${publicIdBase}`,
        resource_type: "image",
      });
      doc[fieldName] = result.secure_url;
      await doc.save();
      successCount++;
      console.log(`✔️  ${Model.modelName} ${doc._id} -> ${result.secure_url}`);
    } catch (err) {
      failCount++;
      console.warn(`❌  ${Model.modelName} ${doc._id} failed: ${err.message}`);
    }
  }

  console.log(
    `[${Model.modelName}] Migration done for '${fieldName}'. Success: ${successCount}, Fail: ${failCount}.`
  );
}

(async () => {
  try {
    await connectDB();

    await migrateField(BlogPost, "coverImageUrl");
    await migrateField(User, "profileImageUrl");
    await migrateField(About, "profileImageUrl");

    await mongoose.connection.close();
    console.log("\nAll done. Connection closed.");
    process.exit(0);
  } catch (e) {
    console.error("Migration failed:", e);
    process.exit(1);
  }
})();
