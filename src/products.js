var Products = {
  cartData: {},
  cartList: [],

  init: function () {
    Products.loadProducts();
    $(".minicart").click(function (e) {
      e.stopPropagation();
    });
  },

  loadProducts: function () {
    let product;

    // 'http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline'
    $.get("data.json", function (data) {
      $.each(data, function (key, row) {
        product = $(".product-container.d-none").clone();
        product.data("price", row.price);
        product.data("id", row.id);
        product.find("img").attr("src", row.image_link);
        product.find("h6").html(row.name);
        product.find("p").html("$ " + row.price);
        product.find("button").click(function (e) {
          addToCart(row);
          e.stopPropagation();
          $(".minicart").show();
        });
        $(document).click(function () {
          $(".minicart").hide();
        });
        product.toggleClass("d-none").appendTo(".products-container");
      });
    });
  },
};

function addToCart(productClicked) {
  console.log("addingToCart", productClicked);
  let found = false;
  for (let i = 0; i < Products.cartList.length; i++) {
    if (Products.cartList[i].product.id === productClicked.id) {
      Products.cartList[i].qty += 1;
      found = true;
    }
  }
  if (!found) {
    Products.cartList.push({ qty: 1, product: productClicked });
  }

  console.log(Products.cartList);
  productsInCart(productClicked.id);
}

function decrementCart(e) {
  const productId = parseInt(e.target.id);
  for (let i = 0; i < Products.cartList.length; i++) {
    if (Products.cartList[i].product.id === productId) {
      console.log(productId);
      Products.cartList[i].qty--;
    }
    if (Products.cartList[i].qty <= 0) {
      Products.cartList.splice(i, 1);
    }
  }
  updateCartTotal();
}

function incrementCart(e) {
  const productId = parseInt(e.target.id);
  for (let i = 0; i < Products.cartList.length; i++) {
    if (Products.cartList[i].product.id === productId) {
      Products.cartList[i].qty++;
    }
  }
  updateCartTotal();
}

function updateCartTotal() {
  let cartTotal = 0;
  for (let i = 0; i < Products.cartList.length; i++) {
    cartTotal =
      cartTotal + Products.cartList[i].product.price * Products.cartList[i].qty;
  }
  cartTotal = Math.round(cartTotal * 100) / 100;

  return cartTotal;
}

function productsInCart() {
  const cartDiv = document.getElementById("minicart");
  cartDiv.innerHTML = "";
  for (let i = 0; i < Products.cartList.length; i++) {
    const productContainers = document.createElement("div");
    productContainers.className = "cart-containers";

    const imgContainer = document.createElement("div");
    imgContainer.className = "img-div";
    const image = document.createElement("img");
    image.className = "product-img";
    image.alt = "Makeup Product";
    image.src = Products.cartList[i].product.image_link;

    const infoContainer = document.createElement("div");
    infoContainer.className = "info-div";

    const nameContainer = document.createElement("div");
    nameContainer.className = "name-div";
    const productName = document.createElement("span");
    productName.className = "product-name";
    productName.innerText =
      Products.cartList[i].product.name.substring(0, 27) + "...";

    const qtyPriceContainer = document.createElement("div");
    qtyPriceContainer.className = "qty-price-div";

    const qtyContainer = document.createElement("div");
    qtyContainer.className = "qty-div";

    const decrementBtn = document.createElement("button");
    decrementBtn.className = "dec-btn";
    decrementBtn.id = Products.cartList[i].product.id;
    decrementBtn.innerHTML = "-";
    decrementBtn.addEventListener("click", (e) => {
      decrementCart(e);
      productsInCart();
    });

    const productQty = document.createElement("span");
    productQty.className = "product-qty";
    productQty.innerHTML = Products.cartList[i].qty;

    const incrementBtn = document.createElement("button");
    incrementBtn.className = "inc-btn";
    incrementBtn.id = Products.cartList[i].product.id;
    incrementBtn.innerHTML = "+";
    incrementBtn.addEventListener("click", (e) => {
      incrementCart(e);
      productsInCart();
    });

    const priceContainer = document.createElement("div");
    priceContainer.className = "price-div";
    const productPrice = document.createElement("span");
    productPrice.className = "product-price";
    productPrice.innerHTML = "$ " + Products.cartList[i].product.price;

    productContainers.appendChild(imgContainer);
    imgContainer.appendChild(image);
    productContainers.appendChild(infoContainer);
    infoContainer.appendChild(nameContainer);
    nameContainer.appendChild(productName);
    infoContainer.appendChild(qtyPriceContainer);
    qtyPriceContainer.appendChild(qtyContainer);
    qtyContainer.appendChild(decrementBtn);
    qtyContainer.appendChild(productQty);
    qtyContainer.appendChild(incrementBtn);
    qtyPriceContainer.appendChild(priceContainer);
    priceContainer.appendChild(productPrice);
    cartDiv.appendChild(productContainers);
  }

  const totalContainer = document.createElement("div");
  totalContainer.className = "total-sum-div";
  const cartTotal = document.createElement("p");
  cartTotal.id = "cart-total";
  const total = updateCartTotal();
  if (total === 0) {
    cartTotal.innerHTML = "Nothing in cart";
  } else {
    cartTotal.innerHTML = "Total: " + "$ " + total.toString();
  }

  cartDiv.appendChild(totalContainer);
  totalContainer.appendChild(cartTotal);
}

$(Products.init);
