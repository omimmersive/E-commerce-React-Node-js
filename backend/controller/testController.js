const Test = require("../models/Test");

const addTest = async (req, res) => {
  try {
    const newTest = new Test(req.body);
    await newTest.save();
    res.status(200).send({
      message: "Test Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// all multiple Test
const addAllTest = async (req, res) => {
  // console.log("Test", req.body);
  try {
    await Test.deleteMany();

    await Test.insertMany(req.body);

    res.status(200).send({
      message: "Test Added Successfully!",
    });
  } catch (err) {
    console.log(err.message);

    res.status(500).send({
      message: err.message,
    });
  }
};

// get status show Test
const getShowingTest = async (req, res) => {
  try {
    const categories = await Test.find({ status: "show" }).sort({
      _id: -1,
    });

    const TestList = readyToParentAndChildrenTest(categories);
    // console.log("Test list", TestList.length);
    res.send(TestList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// get all Test parent and child
const getAllTest = async (req, res) => {
  try {
    const categories = await Test.find({}).sort({ _id: -1 });

    const TestList = readyToParentAndChildrenTest(categories);
    //  console.log('TestList',TestList)
    res.send(TestList);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllTests = async (req, res) => {
  try {
    const categories = await Test.find({}).sort({ _id: -1 });

    res.send(categories);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getTestById = async (req, res) => {
  try {
    const Test = await Test.findById(req.params.id);
    res.send(Test);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Test update
const updateTest = async (req, res) => {
  try {
    const Test = await Test.findById(req.params.id);
    if (Test) {
      Test.name = { ...Test.name, ...req.body.name };
      Test.description = {
        ...Test.description,
        ...req.body.description,
      };
      Test.icon = req.body.icon;
      Test.status = req.body.status;
      Test.parentId = req.body.parentId
        ? req.body.parentId
        : Test.parentId;
      Test.parentName = req.body.parentName;

      await Test.save();
      res.send({ message: "Test Updated Successfully!" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// udpate many Test
const updateManyTest = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        updatedData[key] = req.body[key];
      }
    }

    await Test.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );

    res.send({
      message: "Categories update successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Test update status
const updateStatus = async (req, res) => {
  // console.log('update status')
  try {
    const newStatus = req.body.status;

    await Test.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.status(200).send({
      message: `Test ${
        newStatus === "show" ? "Published" : "Un-Published"
      } Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
//single Test delete
const deleteTest = async (req, res) => {
  try {
    console.log("id cat >>", req.params.id);
    await Test.deleteOne({ _id: req.params.id });
    await Test.deleteMany({ parentId: req.params.id });
    res.status(200).send({
      message: "Test Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }

  //This is for delete children Test
  // Test.updateOne(
  //   { _id: req.params.id },
  //   {
  //     $pull: { children: req.body.title },
  //   },
  //   (err) => {
  //     if (err) {
  //       res.status(500).send({ message: err.message });
  //     } else {
  //       res.status(200).send({
  //         message: 'Test Deleted Successfully!',
  //       });
  //     }
  //   }
  // );
};

// all multiple Test delete
const deleteManyTest = async (req, res) => {
  try {
    const categories = await Test.find({}).sort({ _id: -1 });

    await Test.deleteMany({ parentId: req.body.ids });
    await Test.deleteMany({ _id: req.body.ids });

    res.status(200).send({
      message: "Categories Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
const readyToParentAndChildrenTest = (categories, parentId = null) => {
  const TestList = [];
  let Categories;
  if (parentId == null) {
    Categories = categories.filter((cat) => cat.parentId == undefined);
  } else {
    Categories = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of Categories) {
    TestList.push({
      _id: cate._id,
      name: cate.name,
      parentId: cate.parentId,
      parentName: cate.parentName,
      description: cate.description,
      icon: cate.icon,
      status: cate.status,
      children: readyToParentAndChildrenTest(categories, cate._id),
    });
  }

  return TestList;
};

module.exports = {
  addTest,
  addAllTest,
  getAllTest,
  getAllTests,
  getShowingTest,
  getTestById,
  updateTest,
  updateStatus,
  deleteTest,
  deleteManyTest,
  updateManyTest,
};
