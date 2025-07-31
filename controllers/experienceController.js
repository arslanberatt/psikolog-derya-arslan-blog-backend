const Experience = require("../models/Experience");

const createExperience = async (req, res) => {
  try {
    const { year, title, institution, description } = req.body;

    const titleTrimmed = title.trim();
    const titleExists = await Experience.findOne({ title: titleTrimmed });
    if (titleExists) {
      return res
        .status(400)
        .json({ message: "Böyle bir deneyim zaten mevcut." });
    }

    const experience = await Experience.create({
      year,
      title: titleTrimmed,
      institution,
      description,
    });

    res.json(experience);
  } catch (error) {
    console.error("Deneyim oluşturma hatası:", error.message);
    res.status(500).json({
      message: "Deneyim oluşturulurken sunucu hatası oluştu.",
    });
  }
};

const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ year: -1 });
    res.json(experiences);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Deneyimler alınırken hata oluştu.", error });
  }
};

const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience)
      return res.status(404).json({ message: "Böyle bir deneyim bulunamadı!" });

    const updateData = req.body;
    const updateExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updateExperience);
  } catch (error) {
    res.status(500).json({
      message: "Deneyim güncellenirken sunucu hatası oluştu.",
    });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ message: "Böyle bir deneyim bulunamadı!" });
    await experience.deleteOne();
    res.json({ message: "Deneyim silindi!" });
  } catch (error) {
    res.status(500).json({
      message: "Deneyim silinirken sunucu hatası oluştu.",
    });
  }
};

module.exports = {
  createExperience,
  getAllExperiences,
  updateExperience,
  deleteExperience,
};
