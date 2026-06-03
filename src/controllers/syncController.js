const { syncAll } = require("../services/syncService");

exports.sync = async (req, res) => {
  try {
    const data = await syncAll();
    res.status(200).json({
      success: true,
      message: "Database synced successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};