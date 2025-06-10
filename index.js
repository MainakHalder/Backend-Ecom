const { initializeDatabase } = require("./db/db.connect");
const Product = require("./models/products.models");
const Category = require("./models/categories.models");
const Cart = require("./models/carts.models");
const Wishlist = require("./models/wishlists.model");
const User = require("./models/users.models");
const Order = require("./models/order.models");
initializeDatabase();

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Server is working");
});

const postCategory = async (newCategory) => {
  try {
    const saveCategory = new Category(newCategory);
    const saveCategories = await saveCategory.save();
    return saveCategories;
  } catch (error) {
    console.log(`Error occured while posting: ${error}`);
  }
};

app.post("/V1/categories", async (req, res) => {
  try {
    const saveCategories = await postCategory(req.body);
    if (saveCategories) {
      res.status(200).json(saveCategories);
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while posting: ${error}` });
  }
});

const addProducts = async (newProduct) => {
  try {
    const addProduct = new Product(newProduct);
    const saveProduct = await addProduct.save();
    return saveProduct;
  } catch (error) {
    console.error("Error occured while posting", error);
  }
};

app.post("/V1/products", async (req, res) => {
  try {
    const addProduct = await addProducts(req.body);
    if (addProduct) {
      res.status(200).json(addProduct);
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while posting: ${error}` });
  }
});

const readAllProducts = async () => {
  try {
    const readProduct = await Product.find().populate("category");
    return readProduct;
  } catch (error) {
    console.error("Error occured while fetching", error);
  }
};

app.get("/V1/products", async (req, res) => {
  try {
    const readProducts = await readAllProducts();
    if (readProducts?.length) {
      res.status(200).json(readProducts);
    } else {
      res.status(404).json({ error: "Products not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured: ${error}` });
  }
});

const readOneProduct = async (productId) => {
  try {
    const getProduct = await Product.findById(productId).populate("category");
    return getProduct;
  } catch (error) {
    console.error(`Error occured while fetching data: ${error}`);
  }
};

app.get("/V1/products/:productId", async (req, res) => {
  try {
    const getProduct = await readOneProduct(req.params.productId);
    if (getProduct) {
      res.status(200).json(getProduct);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while fetching: ${error}` });
  }
});

const getCategories = async () => {
  try {
    const getCategory = await Category.find();
    return getCategory;
  } catch (error) {
    console.error("Error occured while fetching", error);
  }
};

app.get("/V1/categories", async (req, res) => {
  try {
    const readCategory = await getCategories();
    if (readCategory) {
      res.status(200).json(readCategory);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while fetching: ${error}` });
  }
});

const getOneCategory = async (categoryId) => {
  try {
    const readCategory = await Category.findById(categoryId);
    return readCategory;
  } catch (error) {
    console.error(`Error occured while fetching: ${error}`);
  }
};

app.get("/V1/categories/:categoryId", async (req, res) => {
  try {
    const readCategoryName = await getOneCategory(req.params.categoryId);
    if (readCategoryName) {
      res.status(200).json({ readCategoryName });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while fetching: ${error}` });
  }
});

const updateProduct = async (productId, productToUpdate) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productToUpdate,
      { new: true }
    );
    return updatedProduct;
  } catch (error) {
    console.error(`Error occured while updating: ${error}`);
  }
};

app.post("/V1/products/:productId", async (req, res) => {
  try {
    const updatedProduct = await updateProduct(req.params.productId, req.body);
    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(400).json({ error: `Error occured while updating` });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while updating: ${error}` });
  }
});

const deleteProduct = async (productId) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    return deletedProduct;
  } catch (error) {
    console.error(`Error occured while deleting: ${error}`);
  }
};

app.delete("/V1/products/:productId", async (req, res) => {
  try {
    const deletedProduct = await deleteProduct(req.params.productId);
    if (deletedProduct) {
      res.status(200).json({
        message: "Product deleted successfully",
        product: deletedProduct,
      });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while deleting: ${error}` });
  }
});

const deleteCategory = async (categoryId) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    return deletedCategory;
  } catch (error) {
    console.log(`Error occured while deleting `);
  }
};

app.delete("/V1/categories/:categoryId", async (req, res) => {
  try {
    const deletedCategory = await deleteCategory(req.params.categoryId);
    if (deletedCategory) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while deleting: ${error}` });
  }
});

const postUser = async (userDetail) => {
  try {
    const postDetail = new User(userDetail);
    const postDetails = await postDetail.save();
    return postDetails;
  } catch (error) {
    console.log(`Error occured while posting: ${error}`);
  }
};

app.post("/V1/users", async (req, res) => {
  try {
    const saveData = await postUser(req.body);
    if (saveData) {
      res
        .status(200)
        .json({ message: "Data posted successfully", user: saveData });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while posting: ${error}` });
  }
});

const postCart = async (cartDetail) => {
  try {
    const postDetail = new Cart(cartDetail);
    const saveCart = await postDetail.save();
    return saveCart;
  } catch (error) {
    console.log(`Error occured while posting :${error}`);
  }
};

app.post("/V1/cart", async (req, res) => {
  try {
    const saveCart = await postCart(req.body);
    if (saveCart) {
      res
        .status(200)
        .json({ message: "Data posted successfully", cart: saveCart });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while posting: ${error}` });
  }
});

const postWishlist = async (wishlistDetail) => {
  try {
    const postDetail = new Wishlist(wishlistDetail);
    const saveWishlist = await postDetail.save();
    return saveWishlist;
  } catch (error) {
    console.log(`Error occured while posting: ${error}`);
  }
};

app.post("/V1/wishlist", async (req, res) => {
  try {
    const saveWishlist = await postWishlist(req.body);
    if (saveWishlist) {
      res
        .status(200)
        .json({ message: "Data posted successfully", wishlist: saveWishlist });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while posting: ${error}` });
  }
});

const getUser = async () => {
  try {
    const readUser = await User.find().populate("cart").populate("wishlist");
    return readUser;
  } catch (error) {
    console.error(`Error occured while fetching user: ${error}`);
  }
};

app.get("/V1/users", async (req, res) => {
  try {
    const readUser = await getUser();
    if (readUser) {
      res.status(200).json(readUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured  while fetching: ${error}` });
  }
});

const getCart = async () => {
  try {
    const readCart = await Cart.find().populate("products");
    return readCart;
  } catch (error) {
    console.error(`Error occured: ${error}`);
  }
};

app.get("/V1/cart", async (req, res) => {
  try {
    const readCart = await getCart();
    if (readCart) {
      res.status(200).json(readCart);
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error occured while fetching cart: ${error}` });
  }
});

const getWishlist = async () => {
  try {
    const readWishlist = await Wishlist.find().populate("products");
    return readWishlist;
  } catch (error) {
    console.log(`Error occured while fetching: ${error}`);
  }
};

app.get("/V1/wishlist", async (req, res) => {
  try {
    const readWishlist = await getWishlist();
    if (readWishlist) {
      res.status(200).json(readWishlist);
    } else {
      res.status(404).json({ error: "Wishlist not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while fetching: ${error}` });
  }
});

const updateUser = async (userId, updatedUser) => {
  try {
    const updateById = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });
    return updateById;
  } catch (error) {
    console.log(`Error occured while updating: ${error}`);
  }
};

app.post("/V1/users/:userId", async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.userId, req.body);
    if (updatedUser) {
      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while updating: ${error}` });
  }
});

const updateCart = async (cartItemId, updatedCart) => {
  try {
    const newCartItem = await Cart.findByIdAndUpdate(cartItemId, updatedCart, {
      new: true,
    }).populate("products");
    return newCartItem;
  } catch (error) {
    console.log(`Error occured while updating: ${error}`);
  }
};

app.post("/V1/cart/:cartId", async (req, res) => {
  try {
    const updatedCartItem = await updateCart(req.params.cartId, req.body);
    if (updatedCartItem) {
      res
        .status(200)
        .json({ message: "Cart updated successfully", cart: updatedCartItem });
    } else {
      res.status(404).json({ error: `Cart item not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while updating: ${error}` });
  }
});

const deleteUser = async (userId) => {
  try {
    const deleteByUserId = await User.findByIdAndDelete(userId);
    return deleteByUserId;
  } catch (error) {
    console.log(`Error occured while deleting: ${error}`);
  }
};

app.delete("/V1/users/:userId", async (req, res) => {
  try {
    const deleteUserId = await deleteUser(req.params.userId);
    if (deleteUserId) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while deleting: ${error}` });
  }
});

const deleteCart = async (cartId) => {
  try {
    const deleteByCartId = await Cart.findByIdAndDelete(cartId);
    return deleteByCartId;
  } catch (error) {
    console.log(`Error occured while deleting: ${error}`);
  }
};

app.delete("/V1/cart/:cartId", async (req, res) => {
  try {
    const deleteCartId = await deleteCart(req.params.cartId);
    if (deleteCartId) {
      res.status(200).json({ message: "Cart deleted successfully" });
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while deleting: ${error}` });
  }
});

const deleteWishlist = async (wishlistId) => {
  try {
    const deleteByWishlistId = await Wishlist.findByIdAndDelete(wishlistId);
    return deleteByWishlistId;
  } catch (error) {
    console.log(`Error occured while deleting: ${error}`);
  }
};

app.delete("/V1/wishlist/:wishlistId", async (req, res) => {
  try {
    const deleteWishlistId = await deleteWishlist(req.params.wishlistId);
    if (deleteWishlistId) {
      res.status(200).json({ message: "Wishlist deleted successfully" });
    } else {
      res.status(404).json({ error: "Wishlist not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Error occured while deleting: ${error}` });
  }
});

const postOrder = async (newOrder) => {
  try {
    const newOrderHistory = new Order(newOrder);
    const saveOrder = await newOrderHistory.save();
    return saveOrder;
  } catch (error) {
    console.log(`Error occured while posting order: ${error}`);
  }
};

app.post("/V1/order", async (req, res) => {
  try {
    const saveOrder = await postOrder(req.body);
    if (saveOrder) {
      res
        .status(200)
        .json({ message: "Data uploaded successfully", order: saveOrder });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while posting order" });
  }
});

const getOrder = async () => {
  try {
    const getAllOrders = await Order.find().populate("products");
    return getAllOrders;
  } catch (error) {
    console.log(`Error occured while fetching orders: ${error}`);
  }
};

app.get("/V1/order", async (req, res) => {
  try {
    const getOrders = await getOrder();
    if (getOrders) {
      res.status(200).json(getOrders);
    } else {
      res.status(404).json("Orders not found");
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error occured while fetching data ${error}` });
  }
});

const deleteOrder = async (orderId) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    return deletedOrder;
  } catch (error) {
    console.log(`Error occured while deleting order: ${error}`);
  }
};

app.delete("/V1/order/:orderId", async (req, res) => {
  try {
    const deletedOrder = await deleteOrder(req.params.orderId);
    if (deleteOrder) {
      res.status(200).json({ message: "Order deleted successfully" });
    } else {
      res.status(404).json("Order not found");
    }
  } catch (error) {
    res.status(500).json({ message: `Error occured while deleting: ${error}` });
  }
});

const PORT = process.env.PORT || 6500;
app.listen(PORT, () => {
  console.log("The server is running on port: ", PORT);
});
