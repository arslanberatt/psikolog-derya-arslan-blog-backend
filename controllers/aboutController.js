const About = require("../models/About");

// const createAbout = async (req, res) => {
//   try {
//     const about = new About(req.body);
//     await about.save();
//     res.status(201).json({
//       message: "Hakkımda içeriği başarıyla oluşturuldu.",
//       data: about,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Oluşturma sırasında hata oluştu.", error });
//   }
// };

const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.status(404).json({ message: "Hakkımda içeriği bulunamadı." });
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: "Veri çekilirken hata oluştu.", error });
  }
};

const updateAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id);

    if (!about)
      return res.status(404).json({ message: "Böyle bir yazı bulunamadı!" });

    const updateData = req.body;
    const updateAbout = await About.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updateAbout);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Güncelleme sırasında hata oluştu.", error });
  }
};

module.exports = {
  getAbout,
  updateAbout,
  //createAbout,
};
