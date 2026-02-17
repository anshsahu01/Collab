import Task from "../models/Task.js";
import Activity from "../models/Activity.js";
import { getIO } from "../socket.js";

// Central helper so every task mutation logs + emits activity in one place.
const logActivity = async ({ type, message, taskId, userId, boardId }) => {
  if (!boardId) return null;

  const activity = await Activity.create({
    type,
    message,
    taskId,
    userId,
    boardId,
  });

  const populatedActivity = await Activity.findById(activity._id)
    .populate("userId", "name email")
    .populate("taskId", "title");

  getIO().to(boardId.toString()).emit("activityCreated", populatedActivity);
  return populatedActivity;
};

export const createTask = async (req, res) => {
  try {
    const { title, description, boardId, listId } = req.body;

    // New tasks are appended at the end of the current list.
    const count = await Task.countDocuments({ listId });

    const task = await Task.create({
      title,
      description,
      boardId,
      listId,
      position: count,
      createdBy: req.user._id,
    });

    await logActivity({
      type: "TASK_CREATED",
      message: `Task ${task.title} created`,
      taskId: task._id,
      userId: req.user._id,
      boardId,
    });


    // Realtime board sync for all members currently viewing this board.
    getIO().to(boardId.toString()).emit("taskCreated", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getTasks = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 20;

    const tasks = await Task.find({
      listId: req.params.listId,
    })
      .populate("assignedTo", "name email")
      .sort({ position: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ position: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).select("title boardId assignedTo");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);
    getIO().to(task.boardId.toString()).emit("taskDeleted", { _id: task._id });
    // Keep "My Tasks" accurate for assigned users without full board reload.
    if (task.assignedTo) {
      getIO().to(`user:${task.assignedTo.toString()}`).emit("myTasksRefresh");
    }

    await logActivity({
      type: "TASK_DELETED",
      message: `Task ${task.title} deleted`,
      taskId: task._id,
      userId: req.user._id,
      boardId: task.boardId,
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const existingTask = await Task.findById(req.params.id).select(
      "title boardId assignedTo"
    );

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const nextTitle =
      typeof title === "string" ? title.trim() : existingTask.title;
    if (!nextTitle) {
      return res.status(400).json({ message: "Title is required" });
    }

    const updatePayload = { title: nextTitle };
    if (typeof description === "string") {
      updatePayload.description = description;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { returnDocument: "after" }
    ).populate("assignedTo", "name email");

    getIO().to(existingTask.boardId.toString()).emit("taskUpdated", updatedTask);
    if (existingTask.assignedTo) {
      getIO().to(`user:${existingTask.assignedTo.toString()}`).emit("myTasksRefresh");
    }

    if (existingTask.title !== nextTitle) {
      await logActivity({
        type: "TASK_UPDATED",
        message: `Task renamed from ${existingTask.title} to ${nextTitle}`,
        taskId: existingTask._id,
        userId: req.user._id,
        boardId: existingTask.boardId,
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const moveTask = async (req, res) => {
  try {
    const { taskId, newListId, newPosition } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.listId = newListId;
    task.position = newPosition;

    await task.save();

    await logActivity({
      type: "TASK_MOVED",
      message: `Task ${task.title} moved`,
      taskId: task._id,
      userId: req.user._id,
      boardId: task.boardId,
    });


    getIO().to(task.boardId.toString()).emit("taskMoved", task);
    if (task.assignedTo) {
      getIO().to(`user:${task.assignedTo.toString()}`).emit("myTasksRefresh");
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const assignTask = async (req, res) => {

  try {

    const { taskId, userId } = req.body;
    const existingTask = await Task.findById(taskId).select("assignedTo boardId");
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    // Track previous assignee so both old and new users get refresh events.
    const previousAssignedTo = existingTask.assignedTo?.toString() || null;
    const boardRoomId = existingTask.boardId?.toString();

    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        assignedTo: userId || null   // supports unassign
      },
      { returnDocument: "after" }
    )
      .populate("assignedTo", "name email")
      .populate("boardId", "title")
      .populate("listId", "title");


    // Board members see assignment changes instantly.
    if (boardRoomId) {
      getIO().to(boardRoomId).emit("taskAssigned", task);
    }

    if (userId) {
      getIO().to(`user:${userId}`).emit("myTasksRefresh");
    }

    if (previousAssignedTo && previousAssignedTo !== userId) {
      getIO().to(`user:${previousAssignedTo}`).emit("myTasksRefresh");
    }

    await logActivity({
      type: userId ? "TASK_ASSIGNED" : "TASK_UNASSIGNED",
      message: userId
        ? `Task ${task.title} assigned to ${task.assignedTo?.name || "a user"}`
        : `Task ${task.title} unassigned`,
      taskId: task._id,
      userId: req.user._id,
      boardId: boardRoomId,
    });


    res.json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


export const getMyTasks = async (req, res) => {

  try {

    const tasks = await Task.find({
      assignedTo: req.user._id
    })
      .populate("assignedTo", "name email")
      .populate("boardId", "title")
      .populate("listId", "title");


    res.json(tasks);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });

  }

};



export const searchTasks = async (req,res) => {

  try {

    const {q, boardId} = req.query;

    const tasks = await Task.find({
      boardId,
      title: { $regex: q, $options: "i" }, 
    }).limit(20);

    res.json(tasks);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
}

