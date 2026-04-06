const Claim = require('../models/Claim');

// Fraud Detection Function
function detectFraud(claim) {
  if (claim.location === "fake") return "Fake Location";
  if (claim.weather === "clear") return "No disruption";
  if (claim.isDuplicate) return "Duplicate claim";
  return "Valid";
}

// Process Payout Function
function processPayout(user, amount) {
  return `₹${amount} credited to ${user}`;
}

// Create Claim
exports.createClaim = async (req, res) => {
  try {
    const result = detectFraud(req.body);

    let status = "";
    let reason = "";

    if (result !== "Valid") {
      status = "Rejected ❌";
      reason = result;
    } else {
      status = "Approved ✅";
    }

    let payoutMessage = "";

    if (status === "Approved ✅") {
      payoutMessage = processPayout(req.body.user || "User", 500);
    }

    const newClaim = new Claim({
      ...req.body,
      status,
      reason,
      payoutMessage
    });

    await newClaim.save();

    return res.status(201).json(newClaim);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error' });
  }
};

// Get all claims of logged-in user
exports.getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.json(claims);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error' });
  }
};

// Update claim (reason, amount, status)
exports.updateClaim = async (req, res) => {
  try {
    const claimId = req.params.id;
    const update = {};

    if (typeof req.body.reason === 'string') {
      const reason = req.body.reason.trim();
      if (!reason) {
        return res.status(400).json({ message: 'Reason cannot be empty' });
      }
      update.reason = reason;
    }

    if (req.body.amount !== undefined) {
      const amount = Number(req.body.amount);
      if (Number.isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a valid number' });
      }
      update.amount = amount;
    }

    if (req.body.status !== undefined) {
      const allowedStatus = ['pending', 'approved', 'rejected'];
      if (!allowedStatus.includes(req.body.status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      update.status = req.body.status;
    }

    const updated = await Claim.findOneAndUpdate(
      { _id: claimId, userId: req.user.id },
      update,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error' });
  }
};

// Delete claim
exports.deleteClaim = async (req, res) => {
  try {
    const claimId = req.params.id;
    const deleted = await Claim.findOneAndDelete({ _id: claimId, userId: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    return res.json({ message: 'Claim deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error' });
  }
};

// Auto Claim (optional utility)
exports.autoClaim = async (req, res) => {
  try {
    const weather = 'rain';

    if (weather === 'rain') {
      const claim = await Claim.create({
        userId: req.user.id,
        reason: 'Auto: Heavy Rain',
        amount: 500,
        status: 'pending'
      });

      return res.json({
        message: 'Auto claim triggered',
        claim
      });
    }

    return res.json({ message: 'No claim condition' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error' });
  }
};