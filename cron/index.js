const cron = require("node-cron");
const RefreshToken = require("../models/refreshToken");

// Schedule tasks to be run on the server
const startCronJobs = () => {
  // Run every day at midnight (0 0 * * *)
  cron.schedule("0 0 * * *", async () => {
    console.log("[Cron] Running token cleanup job...");
    try {
      const now = new Date();
      const result = await RefreshToken.deleteMany({ expiresAt: { $lt: now } });
      console.log(`[Cron] Successfully deleted ${result.deletedCount} expired refresh tokens.`);
    } catch (error) {
      console.error("[Cron] Error deleting expired refresh tokens:", error);
    }
  });

  console.log("Cron jobs started successfully.");
};

module.exports = { startCronJobs };
