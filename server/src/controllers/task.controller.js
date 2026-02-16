import Task from "../models/Task.js";
import Activity from "../models/Activity.js";
import { getIO } from "../socket.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, boardId, listId } = req.body;

    const count = await Task.countDocuments({ listId });

    const task = await Task.create({
      title,
      description,
      boardId,
      listId,
      position: count,
      createdBy: req.user._id,
    });

    await Activity.create({
  type: "TASK_CREATED",
  message: `Task "${task.title}" created`,
  taskId: task._id,
  userId: req.user._id,
  boardId,
});


    // realtime emit
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
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    await Activity.create({
  type: "TASK_MOVED",
  message: `Task moved`,
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


    // realtime emit
    if (boardRoomId) {
      getIO().to(boardRoomId).emit("taskAssigned", task);
    }

    if (userId) {
      getIO().to(`user:${userId}`).emit("myTasksRefresh");
    }

    if (previousAssignedTo && previousAssignedTo !== userId) {
      getIO().to(`user:${previousAssignedTo}`).emit("myTasksRefresh");
    }


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

