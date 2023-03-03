class Product {
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
class ProductService {
  productKey = "product";

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
  update(id, product) {
    const list = localStorage.getItem(this.productKey);
    if (list) {
      const array = JSON.parse(list);
      const index = array.findIndex((item) => item.id == id);
      array[index] = product;
      localStorage.setItem(this.productKey, JSON.stringify(array));
      return array[index];
    }
  }
  delete(id) {
    const list = JSON.parse(localStorage.getItem(this.productKey));
    const index = list.findIndex((item) => item.id == id);
    list.splice(index, 1);
    localStorage.setItem(this.productKey, JSON.stringify(list));
  }
  deleteAll() {
    localStorage.setItem(this.productKey, []);
  }
}
class ProductController {
  productService;
  constructor() {
    this.productService = new ProductService();
  }
  listProduct() {
    const list = this.productService.list();
    if (list) {
      return JSON.parse(list);
    }
    return [];
  }

  getProductById(id) {
    const list = this.productService.list();
    if (list) {
      const json = JSON.parse(list);
      const product = json.filter((item) => item.id == id);
      return product[0];
    }
    return null;
  }

  createProduct(name, price, quant) {
    const list = this.productService.list();
    if (list) {
      const id = JSON.parse(list).length + 1;
      const product = new Product(id, name, price, quant);
      this.productService.create(product);
    } else {
      const product = new Product(1, name, price, quant);

      this.productService.create(product);
    }
  }
  updateProduct(id, name, price, quant) {
    const product = new Product(id, name, price, quant);
    this.productService.update(id, product);
  }
  deleteProduct(id) {
    this.productService.delete(id);
  }
  deleteAllProducts() {
    this.productService.deleteAll();
  }
}
/* VARIAVEIS */
const productControler = new ProductController();
const btnSalvar = document.querySelector("#salvar");
const btnEditar = document.querySelector("#editar");
const btnClear = document.querySelector("#clear");
const btnClose = document.querySelector("#fechar-modal-edit");
const btnCloseXMark = document.querySelector("#close-modal-xmark");
const btnCloseXMarkDelete = document.querySelector(
  "#close-modal-xmark-excluir"
);
const btnExcluirPerma = document.querySelector("#excluir-perma");
const btnCloseModalExcluir = document.querySelector("#fechar-modal-excluir");

function getAndValidateInputs(array) {
  const inputs = [];
  array.forEach((inputConfig) => {
    const value = document.querySelector(`#${inputConfig.idInput}`).value;

    inputConfig.validates.forEach((configs) => {
      if (configs.type == "isnull") {
        if (value == null || value.trim() == "" || value == "") {
          alert(
            `${
              configs.messageError ??
              `${inputConfig.nameOfInput} can not be null `
            }`
          );
          return false;
        }
      }
      if (configs.type == "lessOrEqualZero") {
        if (value <= 0) {
          alert(
            `${
              configs.messageError ??
              `${inputConfig.nameOfInput} can not be less or equal than 0 `
            }`
          );
          return false;
        }
      }
      inputs.push({
        nameInput: inputConfig.nameOfInput,
        value,
      });
    });
  });
  return inputs;
}
function clearInputs() {
  document.querySelector("#name").value = "";
  document.querySelector("#price").value = "";
  document.querySelector("#quant").value = "";
}
function clearTable() {
  const tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";
}

/* CARREGAR LISTA DE PRODUTOS */
function cadastrar() {
  const [name, price, quant] = getAndValidateInputs([
    {
      idInput: "name",
      nameOfInput: "name",
      validates: [
        {
          type: "isnull",
          messageError: "O campo nome não pode ser vazio!",
        },
      ],
    },
    {
      idInput: "price",
      nameOfInput: "price",
      validates: [
        {
          type: "lessOrEqualZero",
          messageError: "O campo preço não pode ser igual ou menor que 0",
        },
      ],
    },
    {
      idInput: "quant",
      nameOfInput: "quant",
      validates: [
        {
          type: "lessOrEqualZero",
          messageError:
            "O campo de quantidade não pode ser igual ou menor que 0",
        },
      ],
    },
  ]);
  if (name && price && quant) {
    productControler.createProduct(name.value, price.value, quant.value);
    clearInputs();
    clearTable();
    loadListOfProduct();
  }
}
function editar() {
  const [name, price, quant] = getAndValidateInputs([
    {
      idInput: "name-editar",
      nameOfInput: "name",
      validates: [
        {
          type: "isnull",
          messageError: "O campo nome não pode ser vazio!",
        },
      ],
    },
    {
      idInput: "price-editar",
      nameOfInput: "price",
      validates: [
        {
          type: "lessOrEqualZero",
          messageError: "O campo preço não pode ser igual ou menor que 0",
        },
      ],
    },
    {
      idInput: "quant-editar",
      nameOfInput: "quant",
      validates: [
        {
          type: "lessOrEqualZero",
          messageError:
            "O campo de quantidade não pode ser igual ou menor que 0",
        },
      ],
    },
  ]);
  const id = document.querySelector("#id").value;
  if (id) {
    productControler.updateProduct(id, name.value, price.value, quant.value);
    closeModal("modal");
    clearTable();
    loadListOfProduct();
  }
}
function excluirTodosProdutos() {
  productControler.deleteAllProducts();
  clearTable();
}
function excluir() {
  const id = document.querySelector("#id-excluir").value;
  productControler.deleteProduct(id);
  closeModal("modal-excluir");
  clearTable();
  loadListOfProduct();
}

/* CARREGAR LISTA DE PRODUTOS */
function loadProduct(product) {
  const tr = document.createElement("tr");
  const formatMoney = parseInt(product.price).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  tr.innerHTML = `
  <td>${product.id}</td>
  <td>${product.name}</td>
  <td>${formatMoney}</td>
  <td>${product.quant}</td>
  <td>
    <div class="container-actions">
    <button class="btn-action editar" onclick="showModalEdit(${product.id})"><i class="fa-sharp fa-solid fa-pen-to-square"></i></button>
    <button class="btn-action excluir" onclick="showModalExcluir(${product.id})">
    <i class="fa-sharp fa-solid fa-trash-can"></i>
    </button>
    </div>
    </td>
  `;
  return tr;
}
function loadListOfProduct() {
  const tbody = document.querySelector("#tbody");
  const listProducts = productControler.listProduct();
  if (listProducts) {
    listProducts.forEach((product) => {
      const tr = loadProduct(product);
      tbody.append(tr);
    });
  }
}

/* EVENTOS */
btnSalvar.addEventListener("click", cadastrar);
btnClear.addEventListener("click", excluirTodosProdutos);
btnClose.addEventListener("click", () => {
  closeModal("modal");
});
btnEditar.addEventListener("click", editar);
btnCloseXMark.addEventListener("click", () => {
  closeModal("modal");
});
btnCloseXMarkDelete.addEventListener("click", () => {
  closeModal("modal-excluir");
});
btnCloseModalExcluir.addEventListener("click", () => {
  closeModal("modal-excluir");
});
btnExcluirPerma.addEventListener("click", excluir);
window.addEventListener("load", loadListOfProduct);

/* MODAL */
function showModalEdit(id) {
  const product = productControler.getProductById(id);
  openModal("modal");
  document.querySelector("#id").value = product.id;
  document.querySelector("#name-editar").value = product.name;
  document.querySelector("#price-editar").value = product.price;
  document.querySelector("#quant-editar").value = product.quant;
}
function showModalExcluir(id) {
  const product = productControler.getProductById(id);
  document.querySelector("#id-excluir").value = id;
  const container = document.querySelector("#produto-excluir");
  const formatMoney = parseInt(product.price).toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
  container.innerHTML = `
  <br/>
    <strong>Nome: </strong> ${product.name}<br/><br/>
     <strong>Preço: </strong> ${formatMoney}<br/><br/>
     <strong>Quantidade: </strong> ${product.quant}
  `;
  openModal("modal-excluir");
}
function openModal(id) {
  const modal = document.querySelector(`#${id}`);
  modal.style.display = "block";
}
function closeModal(id) {
  const modal = document.querySelector(`#${id}`);
  modal.style.display = "none";
}
