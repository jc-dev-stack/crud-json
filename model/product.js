export default class Product {
  id;
  name;
  price;
  quant;

  constructor(id, name, price, quant) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quant = quant;
  }
}
