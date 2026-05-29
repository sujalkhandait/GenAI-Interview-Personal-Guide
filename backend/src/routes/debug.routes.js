const express = require("express");

const router = express.Router();

router.post("/client-error", (req, res) => {

    console.error("========== CLIENT ERROR ==========");

    console.error(req.body);

    console.error("==================================");

    res.status(200).json({
        success: true
    });

});

module.exports = router;