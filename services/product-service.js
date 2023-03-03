import { keys } from "../keys.js";

export default class ProductService {
  productKey = keys.product;

  create(product) {
    const list = localStorage.getItem(this.productKey);
    if (list) {
      const array = JSON.parse(list);
      array.push(product);
      localStorage.setItem(this.productKey, JSON.stringify(array));
    } else {
      const datalist = [];
      datalist.push(product);
      localStorage.setItem(this.productKey, JSON.stringify(datalist));
    }
  }
  list() {
    const list = localStorage.getItem(this.productKey);
    return list;
  }
  update(id, product) {}
  delete(id) {}
  deleteAll() {
    localStorage.setItem(this.productKey, []);
  }
}
