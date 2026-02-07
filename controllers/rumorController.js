const RumorModel = require("../models/rumorModel");
const ReportModel = require("../models/reportModel");
const UserModel = require("../models/userModel");

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

    // retrieve user from DB
    const users = await UserModel.getAll();

    // render 'detail.ejs' view
    res.render("detail", {
      rumor: rumor,
      reportCount: reportCount,
      users: users,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// process report submission
exports.report = async (req, res) => {
  try {
    // get form data
    const rumorId = req.body.rumor_id;
    const userId = req.body.user_id;
    const type = req.body.report_type;

    // if select user
    if (!userId) {
      return res.send("กรุณาเลือกผู้ใช้งานก่อนรายงาน");
    }

    // check if user already reported this rumor
    const hasReported = await ReportModel.hasUserReported(userId, rumorId);

    if (hasReported) {
      return res.send(`
                <script>
                    alert("คุณ (User ID: ${userId}) ได้รายงานข่าวนี้ไปแล้ว");
                    window.location.href = "/detail/${rumorId}";
                </script>
            `);
    }

    // save report to DB
    await ReportModel.add(userId, rumorId, type);

    const rumor = await RumorModel.getById(rumorId);

    // if report >= 10 change status to panic
    const count = await ReportModel.countByRumor(rumorId);
    if (count >= 10 && rumor.status === "ปกติ") {
      await RumorModel.updateStatus(rumorId, "panic");
    }

    // redirect back to detail page to show updated info
    res.redirect(`/detail/${rumorId}`);
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
