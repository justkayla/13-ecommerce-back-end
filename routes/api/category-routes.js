const router = require('express').Router();
// Import the model
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// find all categories
// be sure to include its associated Products
router.get('/', async (req, res) => {
  try {
    const resp = await Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(resp);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// find one category by its `id` value
// be sure to include its associated Products
router.get('/:id', async (req, res) => {
  try {
    // Assign selected category to resp
    const resp = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    });
    // If no response with specified id
    if (!resp) {
      // Return `no id` message
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }
    // Success! Return JSON-ified response
    res.status(200).json(resp);
    // Catch any errors
  } catch (err) {
    // Return JSON-ified error message
    res.status(500).json(err.message);
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const resp = await Category.create(req.body);
    res.status(200).json(resp);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// update a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const resp = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!resp[0]) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }

    res.status(200).json(resp);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// delete a category by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const resp = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!resp) {
      res.status(404).json({ message: 'No category with this id!' });
      return;
    }

    res.status(200).json(resp);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
