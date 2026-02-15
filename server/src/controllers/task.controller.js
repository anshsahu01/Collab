import Task from "../models/Task.js";
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

    // realtime emit
    getIO().to(boardId.toString()).emit("taskCreated", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      listId: req.params.listId,
    })
      .populate("assignedTo", "name email")
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

    task.listId = newListId;
    task.position = newPosition;

    await task.save();

    getIO().to(task.boardId.toString()).emit("taskMoved", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

