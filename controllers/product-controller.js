import Product from "../model/product.js";
import ProductService from "../services/product-service.js";

export default class ProductController {
  productService;
  constructor() {
    this.productService = new ProductService();
  }
  listProduct() {
    const list = this.productService.list();
    if (list) {
      return JSON.parse(this.productService.list());
    }
    return [];
  }

  createProduct(name, price, quant) {
    const list = this.productService.list();
    if (list) {
      const id = JSON.parse(list).length;
      const product = new Product(id, name, price, quant);
      this.productService.create(product);
    } else {
      const product = new Product(1, name, price, quant);

      this.productService.create(product);
    }
  }
  deleteAllProducts() {
    this.productService.deleteAll();
  }
}
