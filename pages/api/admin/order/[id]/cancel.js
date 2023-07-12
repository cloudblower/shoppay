import nc from "next-connect";
import auth from "../../../../../middleware/auth";
import Order from "../../../../../models/Order";
import User from "../../../../../models/User";
import db from "../../../../../utils/db";
import admin from "../../../../../middleware/admin";
const handler = nc().use(auth).use(admin);

handler.put(async (req, res) => {
  await db.connectDb();
  const order = await Order.findById(req.query.id);
  if (order) {
    if (order.status == "Cancelled" || order.status == "Completed")
      return res.status(200).json({
        error: "Order is finished.",
      });
    if (order.status != "Processing")
      return res.status(200).json({
        error: "Order has not been packaged.",
      });
    order.status = "Cancelled";
    await order.save();
    const orders = await Order.find({})
      .populate({ path: "user", model: User, select: "name email image" })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({
      message: "Order is cancelled successfully.",
      orders: orders,
    });
    await db.disconnectDb();
  } else {
    await db.disconnectDb();
    res.status(404).json({ message: "Order is not found." });
  }
});

export default handler;
