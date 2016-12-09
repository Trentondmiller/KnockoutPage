function Product(displayName,description,id,listPrice,salePrice,primaryFullImageUrl) {
	this.displayName = ko.observable(displayName);
  this.description = ko.observable(description);
  this.id = ko.observable(id);
  this.listPrice = listPrice;
  this.salePrice = salePrice;
  this.primaryFullImageUrl = ko.observable(primaryFullImageUrl);
};
function CommerceItem(product,quantity) {
  this.product = ko.observable(product);
  this.quantity = ko.observable(quantity);
  this.totalPrice = ko.observable(product.salePrice);
}
function productViewModel() {
  var self = this;
  self.checkoutMessage = ko.observable();
  self.products = ko.observableArray([]);
  self.firstName = ko.observable();
  self.lastName = ko.observable();
  self.address = ko.observable();
  self.CCType = ko.observable();
  self.CCNumber = ko.observable();
  self.CCExpMonth = ko.observable();
  self.CCExpYear = ko.observable();
  self.CVCCode = ko.observable();
  self.cart = ko.observableArray();
  self.CCTypes = ko.observableArray(['Visa','MasterCard']);
  self.months = ko.observableArray(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']);
  self.years = ko.observableArray(['2016','2017','2018','2019','2020','2021','2022','2023','2024','2025']);

  self.addProductToCart = function(product) {
    productPresent = false;
    for(var i = 0; i < self.cart().length; i++) {
        if(self.cart()[i].product().id == product.id) {
          self.cart()[i].quantity(self.cart()[i].quantity() + 1);
          self.cart()[i].totalPrice(self.cart()[i].quantity() * self.cart()[i].product().salePrice);
          productPresent = true;
        }
    }
    if(!productPresent) {
      self.cart.push(new CommerceItem(product,1));
    }
    self.cart.valueHasMutated();
  }
  self.removeProductFromCart = function(commerceItem) {
	  self.cart.remove(commerceItem);
  }
  self.cartTotal = ko.computed(function() {
  		var total = 0;
			for(var i = 0; i < self.cart().length; i++) {
      		total += self.cart()[i].product().salePrice * self.cart()[i].quantity();
      }
      return total;
  });
  $.getJSON("https://crossorigin.me/https://ccstore-z5ia.oracleoutsourcing.com/ccstoreui/v1/products", function(json) {
    var jsonData = JSON.stringify(json);
    var items = json.items;
    var array = self.products();
    for(var i = 0; i < items.length; i++) {
      var imageUrl = "https://ccstore-z5ia.oracleoutsourcing.com" + items[i].primaryFullImageURL;
      array.push(new Product(items[i].displayName, items[i].description, items[i].id, items[i].listPrice,items[i].salePrice, imageUrl));
    }
    self.products.valueHasMutated();
});

    self.checkout = function() {
    console.log("User checked out with credentials:");
    console.log("First Name: " + self.firstName);
    console.log("Last Name: " + self.lastName);
    console.log("Address: " + self.address);
    console.log("CCType: " + self.CCType);
    console.log("CCNumber: " + self.CCNumber);
    console.log("CCExpiration Month: " + self.CCExpMonth);
    console.log("CCExpiration Year: " + self.CCExpYear);
    console.log("CVCCode: " + self.CVCCode);
    console.log("Total Amount Paid: $" + self.cartTotal());
    self.cart.removeAll();
    self.firstName("");
    self.lastName("");
    self.address("");
    self.CCType("Visa");
    self.CCNumber("");
    self.CCExpMonth("");
    self.CCExpYear("");
    self.CVCCode("");
  }
}
ko.observable.fn.toString = function() {
        return ko.toJSON(this(), null, 2);
    };
ko.applyBindings(new productViewModel());