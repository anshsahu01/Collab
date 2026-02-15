import List from "../models/List.js";
export const createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;

    const count = await List.countDocuments({ boardId });

    const list = await List.create({
      title,
      boardId,
      position: count,
    });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLists = async (req, res) => {
  try {
    const lists = await List.find({
      boardId: req.params.boardId,
    }).sort({ position: 1 });

    res.json(lists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteList = async (req, res) => {
  try {
    await List.findByIdAndDelete(req.params.id);
    res.json({ message: "List deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
