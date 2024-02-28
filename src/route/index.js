// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = [];
  constructor(email, login, password) {
    this.email = email;
    this.login = login;
    this.password = password;
    this.id = new Date().getTime()
  }

  verifyPassword = (password) => this.password === password;

  static add = (user) => {
    this.#list.push(user);
  }
  static getList = () => this.#list;

  static getById = (id) => this.#list.find((user) => user.id === id);

  static deleteById = (id) => {
    const index = this.#list.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.#list.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
  static updateById = (id, data) => {
    const user = this.getById(id);
    if (user) {
      this.update(user, data)
      return true;
    } else {
      return false;
    }
  }
  static update = (user, { email }) => {
    if (email) {
      user.email = email
    }
  }
}

class Product {
  static #list = [];
  constructor(name, price, description) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.id = Math.floor(Math.random() * 100000);
    this.createDate = new Date().toISOString();
  }

  static add = (product) => {
    this.#list.push(product);
  };

  static getList = () => this.#list;

  static getById(id) {
    return this.#list.find(product => product.id === id);
  }

  static updateById = (id, data) => {
    const product = this.getById(id);
    if (product) {
      this.update(product, data);
      return true;
    } else {
      return false;
    }
  };

  static update = (product, { name, price, description }) => {
    if (name) {
      product.name = name;
    }
    if (price) {
      product.price = price;
    }
    if (description) {
      product.description = description;
    }
  };

  static deleteById = (id) => {
    const index = this.#list.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true;
    } else {
      return false;
    }
  }
}

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  const list = User.getList()
  console.log(list);
  res.render('index', {
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      }
    },
  })
})

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body;
  const user = new User(email, login, password);
  User.add(user);
  console.log(User.getList());
  res.render('success-info', {
    style: 'success-info',
    info: 'User created',
  })
})

router.get('/user-delete', function (req, res) {
  const { id } = req.query;
  User.deleteById(Number(id));

  res.render('success-info', {
    style: 'success-info',
    info: 'User deleted',
  })
})

router.post('/user-update', function (req, res) {
  const { email, password, id } = req.body;
  let result = false;  
  const user = User.getById(Number(id))
  if (user.verifyPassword(password)) {
    User.update(user, { email })
    result = true;
  }

  res.render('success-info', {
    style: 'success-info',
    info: result ? 'Email updated' : 'Error',
  })
})

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body;
  const product = new Product(name, price, description);
  Product.add(product);
  res.render('alert', {
    style: 'alert',
    info: 'Product created',
  })
})

router.get('/product-list', function (req, res) {
  const list = Product.getList();
  res.render('product-list', {
    style: 'product-list',
    data: {
      product: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
})

router.get('/product-edit', function (req, res) {
  const { id } = req.query; 
  const product = Product.getById(Number(id));
  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      data: {
        product,
      },
    });
  } else {
    res.render('alert', {
      style: 'alert',
      info: 'Товар з таким ID не знайдено',
    });
  }
});

router.post('/product-edit', function (req, res) {
  const { name, price, description, id } = req.body;
  let result = false;
  const product = Product.getById(Number(id))
  if (product) { 
    Product.update(product, { name, price, description });
    result = true;
  }
  res.render('alert', {
    style: 'alert',
    info: result ? 'Product successfully updated' : 'Failed to update product'
  });
});

router.get('/product-delete', function (req, res) {
  const { id } = req.query;
  Product.deleteById(Number(id));
  res.render('alert', {
    style: 'alert',
    info: 'Product is deleted',
  })
})
// ================================================================

module.exports = router
