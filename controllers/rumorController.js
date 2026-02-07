const RumorModel = require("../models/rumorModel");
const ReportModel = require("../models/reportModel");

exports.index = async (req, res) => {
  try {
    const rumors = await RumorModel.getAll(); // retrieve all rumors from DB
    res.render("index", { rumors }); // render 'index.ejs' view with rumors data
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// show rumor detail page
exports.detail = async (req, res) => {
  try {
    const rumorId = req.params.id; // get rumor id
    const rumor = await RumorModel.getById(rumorId); // find rumor by id

    if (!rumor) {
      return res.send("ไม่พบข้อมูลข่าวลือนี้");
    }

    const reportCount = await ReportModel.countByRumor(rumorId); // count total reports for this rumor

    // mockup users for simulation
    const mockUsers = [
      { id: 1, name: "Somchai (ผู้ใช้ทั่วไป)" },
      { id: 2, name: "Somsri (ผู้ใช้ทั่วไป)" },
      { id: 3, name: "John Doe (ผู้ตรวจสอบ)" },
      { id: 4, name: "Alice (ผู้ใช้ทั่วไป)" },
      { id: 5, name: "Bob (ผู้ใช้ทั่วไป)" },
      { id: 6, name: "Charlie (ผู้ใช้ทั่วไป)" },
      { id: 7, name: "Dave (ผู้ตรวจสอบ)" },
      { id: 8, name: "Eve (ผู้ใช้ทั่วไป)" },
      { id: 9, name: "Frank (ผู้ใช้ทั่วไป)" },
      { id: 10, name: "Grace (ผู้ใช้ทั่วไป)" },
    ];

    // render 'detail.ejs' view
    res.render("detail", {
      rumor: rumor,
      reportCount: reportCount,
      users: mockUsers,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// process report submission
exports.report = async (req, res) => {
  try {
    const { rumor_id, user_id, report_type } = req.body; // get form data

    // cannot report if already verified
    const rumor = await RumorModel.getById(rumor_id);
    if (["verified_true", "verified_false"].includes(rumor.status)) {
      return res.send(
        '<script>alert("ข่าวนี้ตรวจสอบแล้ว ห้ามรายงานเพิ่ม"); window.history.back();</script>',
      );
    }

    // check if user already reported this rumor
    const hasReported = await ReportModel.hasUserReported(user_id, rumor_id);
    if (hasReported) {
      return res.send(
        '<script>alert("คุณเคยรายงานข่าวนี้แล้ว"); window.history.back();</script>',
      );
    }

    // save report to DB
    await ReportModel.add(user_id, rumor_id, report_type);

    // if report >= 10 change status to panic
    const count = await ReportModel.countByRumor(rumor_id);
    if (count >= 10 && rumor.status === "ปกติ") {
      await RumorModel.updateStatus(rumor_id, "panic");
    }

    // redirect back to detail page to show updated info
    res.redirect(`/detail/${rumor_id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// show summary page
exports.summary = async (req, res) => {
  try {
    const allRumors = await RumorModel.getAll(); // get all rumors data
    const panicRumors = allRumors.filter((r) => r.status === "panic"); // filter only panic
    const verifiedRumors = allRumors.filter((r) => 
      ["verified_true", "verified_false"].includes(r.status),
    ); // filter only verified rumors

    res.render("summary", { panicRumors, verifiedRumors }); // render 'summary.ejs'
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// search Logic
exports.searchForm = (req, res) => {
  res.render("search", { error: null });
};

exports.processSearch = async (req, res) => {
  const { search_id } = req.body; // get input id
  const idPattern = /^[1-9]\d{7}$/; // 8 digits, not starting with 0

  if (!idPattern.test(search_id)) {
    return res.render("search", {
      error: "รูปแบบ ID ไม่ถูกต้อง (ต้องเป็นเลข 8 หลัก และไม่ขึ้นต้นด้วย 0)",
    });
  }

  try {
    const rumor = await RumorModel.getById(search_id); // find rumor by id in DB
    if (rumor) {
      res.redirect(`/detail/${search_id}`);
    } else {
      res.render("search", { error: "ไม่พบหมายเลขข่าวลือนี้ในระบบ" });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};
