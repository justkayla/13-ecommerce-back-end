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
      include: [{ model: Category, through: Tag, as: 'product_tags' }]
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
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
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
