const Service = require("../models/Service");

// Yeni hizmet oluştur
const createService = async (req, res) => {
  try {
    const { title, description, related } = req.body; // blogId buradan gelecek

    if (!related) {
      return res.status(400).json({ message: "Lütfen ilgili blogu seçin." });
    }

    const titleTrimmed = title.trim();
    const titleExists = await Service.findOne({ title: titleTrimmed });
    if (titleExists) {
      return res
        .status(400)
        .json({ message: "Böyle bir hizmet zaten mevcut." });
    }

    const service = await Service.create({
      title: titleTrimmed,
      description,
      related,
    });

    // Blog bilgisini de populate ederek geri döndürelim
    await service.populate("related", "title");

    res.status(201).json(service);
  } catch (error) {
    console.error("Hizmet oluşturma hatası:", error.message);
    res.status(500).json({
      message: "Hizmet oluşturulurken sunucu hatası oluştu.",
    });
  }
};

// Tüm hizmetleri getir
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("related", "title") // sadece blog title
      .sort({ title: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({
      message: "Hizmetler alınırken hata oluştu.",
      error: error.message,
    });
  }
};

// Hizmeti güncelle
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Böyle bir hizmet bulunamadı!" });
    }

    const updatedService = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("related", "title");

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({
      message: "Güncelleme sırasında hata oluştu.",
      error: error.message,
    });
  }
};

// Hizmeti sil
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Böyle bir hizmet bulunamadı!" });
    }

    await service.deleteOne();
    res.json({ message: "Hizmet silindi." });
  } catch (error) {
    res.status(500).json({
      message: "Silme işlemi sırasında hata oluştu.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService,
};
