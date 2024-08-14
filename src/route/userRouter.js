const { Router } = require("express");
const userModel = require("../model/userModel");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { title, rating, q, sortBy, order, page = 1, limit = 4 } = req.query;

    const query = {};

    if (title) {
      query.title = title;
    }

    if (rating) {
      query.rating = rating;
    }

    if (q) {
      query.title = new RegExp(q, "i");
    }

    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    }

    // Pagination logic
    const pageNumber = parseInt(page, 5) || 1;
    const limitNumber = parseInt(limit, 5) || 4;
    const skip = (pageNumber - 1) * limitNumber;

    // console.log(`page: ${pageNumber}, limit: ${limitNumber}, skip: ${skip}`);

    const data = await userModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    // console.log(data);

    const total = await userModel.countDocuments(query);

    res.send({
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
      totalMovies: total,
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const data = await userModel.create(req.body);
    res.status(200).json({ message: "successfully created" });
  } catch (error) {
    console.log(error);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    // res.send("patch Route");

    const { id } = req.params;
    const { title, rating } = req.body;

    const updateUser = await userModel.findByIdAndUpdate(
      id,
      { title, rating },
      { new: true, runValidators: true }
    );

    if (!updateUser) {
      res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "user updated successfully", data: updateUser });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await userModel.findByIdAndDelete(id);

    if (!deleteUser) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
