import Board from "../models/Board.js";

export const createBoard = async (req, res) => {
  try {
    const board = await Board.create({
      title: req.body.title,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      members: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate("members", "name email");

    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
