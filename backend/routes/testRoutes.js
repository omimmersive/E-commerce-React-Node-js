const express = require('express');
const router = express.Router();
const {
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
  updateManyTest

} = require('../controller/testController');

//add a Test
router.post('/add', addTest);

//add all Test
router.post('/add/all', addAllTest);

//get only showing Test
router.get('/show', getShowingTest);

//get all Test
router.get('/', getAllTest);
//get all Test
router.get('/all', getAllTests);

//get a Test
router.get('/:id', getTestById);

//update a Test
router.put('/:id', updateTest);

//show/hide a Test
router.put('/status/:id', updateStatus);

//delete a Test
router.delete('/:id', deleteTest);

// delete many Test
router.patch('/delete/many', deleteManyTest);

// update many Test
router.patch('/update/many', updateManyTest);

module.exports = router;
