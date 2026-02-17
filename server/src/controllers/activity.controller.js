import Activity from "../models/Activity.js";

export const getBoardActivities = async (req, res) => {
  try {
    const { boardId } = req.params;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

    const [activities, total] = await Promise.all([
      Activity.find({ boardId })
        .populate("userId", "name email")
        .populate("taskId", "title")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Activity.countDocuments({ boardId }),
    ]);

    res.json({
      data: activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
