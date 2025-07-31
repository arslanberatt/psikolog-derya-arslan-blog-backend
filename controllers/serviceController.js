const Service = require("../models/Service");

const createService = async (req, res) => {
  try {
    const { title, description } = req.body;

    const titleTrimmed = title.trim();
    const titleExists = await Service.findOne({ title: titleTrimmed });
    if (titleExists) {
      return res
        .status(400)
        .json({ message: "Böyle bir hizmet zaten mevcut." });
    }

    const service = await Service.create({
      title,
      description,
    });

    res.json(service);
  } catch (error) {
    console.error("Hizmet oluşturma hatası:", error.message);
    res.status(500).json({
      message: "Hizmet oluşturulurken sunucu hatası oluştu.",
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ title: 1 });
    res.json(services);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Hizmetler alınırken hata oluştu.", error });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Böyle bir hizmet bulunamadı!" });
    const updateData = req.body;
    const updateService = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updateService);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Güncelleme sırasında hata oluştu.", error });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Böyle bir hizmet bulunamadı!" });
    await service.deleteOne();
    res.json({ message: "Hizmet silindi." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Silme işlemi sırasında hata oluştu.", error });
  }
};

module.exports = {
  getAllServices,
  createService,
  updateService,
  deleteService,
};
