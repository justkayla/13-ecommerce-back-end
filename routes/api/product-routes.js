const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');
const { restore } = require('../../models/Product');

// The `/api/products` endpoint

// get all products
// be sure to include its associated Category and Tag data
router.get('/', async (req, res) => {
  try {
    const resp = await Product.findAll({
      include: [{ model: Category, model: Tag, through: ProductTag, as: 'product_tags' }]
    });
    res.status(200).json(resp);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// get one product
// be sure to include its associated Category and Tag data
router.get('/:id', async (req, res) => {
  try {
    // Assign selected product to resp
    const resp = await Product.findByPk(req.params.id, {
      include: [{ model: Category, model: Tag, through: ProductTag, as: 'product_tags' }]
    });
    // If no response with specified id
    if (!resp) {
      // Return `no id` message
      res.status(404).json({ message: 'No product with this id!' });
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

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    const resp = await Product.create(
      {
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        tagIds: req.body.tagIds
      }
    );
    res.status(200).json(resp);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const resp = await Product.update(
      {
        // All the fields you can update and the data attached to the request body.
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        tagIds: req.body.tagIds
      },
      {
        // Gets a product based on the id given in the request parameters
        where: {
          id: req.params.id,
        },
      }
    );
    if (!resp) {
      res.status(404).json({ message: 'No product with this id! ' });
      return;
    }
    res.status(200).json(resp);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// delete one product by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const resp = await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    if (!resp) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    }
    res.status(200).json(resp);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
