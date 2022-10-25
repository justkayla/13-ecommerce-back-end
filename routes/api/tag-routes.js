const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// find all tags
// be sure to include its associated Product data
router.get('/', async (req, res) => {
  try {
    const resp = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'tag_products' }]
    });
    res.status(200).json(resp);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// find a single tag by its `id`
// be sure to include its associated Product data
router.get('/:id', async (req, res) => {
  try {
    // Assign selected tag to resp
    const resp = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'tag_products' }]
    });
    // If no response with specified id
    if (!resp) {
      // Return `no id` message
      res.status(404).json({ message: 'No tag with this id!' });
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

// create a new tag
router.post('/', async (req, res) => {
  /* req.body
    {
      tag_name: "purple"  
    }
  */
  try {
    const resp = await Tag.create(
      {
        tag_name: req.body.tag_name,
      }
    );
    res.status(200).json(resp);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const resp = await Tag.update(
      {
        // All the fields you can update and the data attached to the request body.
        tag_name: req.body.tag_name,
      },
      {
        // Gets a tag based on the tag_id given in the request parameters
        where: {
          id: req.params.id,
        },
      }
    );
    if (!resp) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(resp);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const resp = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!resp) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(resp);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
