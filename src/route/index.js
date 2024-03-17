// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = [];
  static #count = 0;

  constructor(img, title, description, category, price, amount = 0) {
    this.id = ++Product.#count;
    this.img = img;
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = price;
    this.amount = amount;
  }

  static add(...data) {
    const newProduct = new Product(...data);
    this.#list.push(newProduct);
  }

  static getList() {
    return this.#list;
  }
  
  static getById(id) {
    return this.#list.find(product => product.id === id);
  }

  static getRandomList(id) {
    const filteredList = this.#list.filter(product => product.id !== id);
    const shuffleList = filteredList.sort(() => Math.random() - 0.5);
    return shuffleList.slice(0, 3);
  }
}

Product.add(
  'https://picsum.photos/seed/picsum/200/300',
  'Компютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel',
  'Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  25000,
  10
);

Product.add(
  'https://picsum.photos/seed/picsum/200/300',
  'Компютер ARTLINE Gaming by ASUS TUF v119 (TUFv119)',
  'Intel Core i9-13900KF (3.0 - 5.8 ГГц) / RAM 64 ГБ / SSD 2 ТБ (2 x 1 ТБ) / nVidia GeForce RTX 4070 Ti, 12 ГБ / без ОД / LAN / Wi-Fi / Bluetooth / без ОС',
  [
    { id: 2, text: 'Топ продажів' },
  ],
  22000,
  10
);

Product.add(
  'https://picsum.photos/seed/picsum/200/300',
  'Компютер Artline Gaming (X43v31) AMD Ryzen 5 3600/',
  'AMD Ryzen 5 3600 (3.6 - 4.2 ГГц) / RAM 16 ГБ / HDD 1 ТБ + SSD 480 ГБ / nVidia GeForce RTX 3050, 8 ГБ / без ОД / LAN / без ОС',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10
);

Product.add(
  'https://picsum.photos/seed/picsum/200/300',
  'Компютер COBRA Advanced (I11F.8.H1S2.15T.13356) Intel',
  'Intel Core i3-10100F (3.6 - 4.3 ГГц) / RAM 8 ГБ / HDD 1 ТБ + SSD 240 ГБ / GeForce GTX 1050 Ti, 4 ГБ / без ОД / LAN / Linux',
  [
    { id: 2, text: 'Топ продажів' },
  ],
  32000,
  10
);

class Purchase {
  static DELIVERY_PRICE = 150;
  static #BONUS_FACTOR = 0.1;
  static #count = 0;
  static #list = [];
  static #bonusAccount = new Map();

  static getBonusBalance(email) {
    return this.#bonusAccount.get(email) || 0;
  }

  static calcBonusAmount(value) {
    return value * Purchase.#BONUS_FACTOR;
  }

  static updateBonusBalance(email, price, bonusUse = 0) {
    const amount = Purchase.calcBonusAmount(price);
    const currentBalance = Purchase.getBonusBalance(email);
    const updatedBalance = currentBalance + amount - bonusUse;
    Purchase.#bonusAccount.set(email, updatedBalance);
    return amount;
  }

  constructor(data, product) {
    this.id = ++Purchase.#count;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.phone = data.phone;
    this.email = data.email;
    this.comment = data.comment || null;
    this.bonus = data.bonus || 0;
    this.promocode = data.promocode || null;
    this.totalPrice = data.totalPrice;
    this.productPrice = data.productPrice;
    this.deliveryPrice = data.deliveryPrice;
    this.amount = data.amount;
    this.product = product;
  }

  static add(...args) {
    const newPurchase = new Purchase(...args);
    Purchase.#list.push(newPurchase);
    return newPurchase;
  }

  static getList() {
    return Purchase.#list.reverse();
  }

  static getById(id) {
    return Purchase.#list.find(item => item.id === id);
  }

  static updateById(id, data) {
    const purchase = Purchase.getById(id);
    if (purchase) {
      if (data.firstname) {
        purchase.firstname = data.firstname;
      }
      if (data.lastname) {
        purchase.lastname = data.lastname;
      }
      if (data.phone) {
        purchase.phone = data.phone;
      }
      if (data.email) {
        purchase.email = data.email;
      }
      return true;
    } else {
      return false;
    }
  }
}

class Promocode {
  static #list = [];
  constructor(name, factor) {
    this.name = name;
    this.factor = factor;
  }

  static add(name, factor) {
    const newPromoCode = new Promocode(name, factor);
    Promocode.#list.push(newPromoCode);
    return newPromoCode;
  }

  static getByName(name) {
    return this.#list.find(promo => promo.name === name);
  }

  static calc(promo, price) {
    return price * promo.factor;
  }
}

Promocode.add('SUMMER2023', 0.9);
Promocode.add('DISCOUNT50', 0.5);
Promocode.add('SALE25', 0.75);
// router.get Створює нам один ентпоїнт

router.get('/alert', function (req, res) {
  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Operation is successful',
      info: 'The good is created',
      link: '/test-path',
    },
  })
})

router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
})

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})

router.post('/purchase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)
  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Error',
        info: 'Incorrect amount',
        link: `/purchase-product?id=${id}`
      },
    })
  }
  const product = Product.getById(id);

  if (!product || product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Error',
        info: 'Product not available',
        link: `/purchase-product?id=${id}`
      },
    })
  }
  
  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)
  res.render('purchase-create', {
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount} units)`,
          price: productPrice,
        },
        {
          text: 'Delivery',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })

})

router.post('/purchase-submit', function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,
    firstname,
    lastname,
    email,
    phone,
    promocode,
    bonus,
    comment,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Error',
        info: 'Product not found',
        link: '/purchase-list',
      },
    })
  }

  totalPrice = Number(totalPrice);
  productPrice = Number(productPrice);
  deliveryPrice = Number(deliveryPrice);
  amount = Number(amount);
  bonus = Number(bonus);

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email);
    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }
    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      firstname,
      lastname,
      email,
      phone,
      comment,
    },
    product,
  );

  console.log(purchase)

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Success',
      info: 'Order created',
      link: '/purchase-list',
    },
  })
})

router.get('/purchase-list', function (req, res) {
  const list = Purchase.getList();
  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      list,
    },
  })
})

router.get('/purchase-data', function (req, res) {
  const id = Number(req.query.id);
  const product = Purchase.getById(id);
  res.render('purchase-data', {
    style: 'purchase-data',
    data: {
      product,
    },
  });
});

router.get('/purchase-edit', function (req, res) {
  const id = Number(req.query.id);
  const product = Purchase.getById(id);
  console.log(product)
  res.render('purchase-edit', {
    style: 'purchase-edit',
    data: {
      product,
    },
  });
});

router.post('/purchase-edit', function (req, res) {
  const id = Number(req.body.id);
  const {
    firstname,
    lastname,
    email,
    phone,
  } = req.body;
  let result = false;
  const product = Purchase.getById(id);
  console.log(product)
  if (product) {
    Purchase.updateById(id, {
      firstname,
      lastname,
      email,
      phone,
    });
    result = true;
  }
  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Success',
      info: result ? 'Product successfully updated' : 'Failed to update product',
      link: '/purchase-list',
    },
  });
});
module.exports = router
