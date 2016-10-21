function Product(displayName,description,id,listPrice,salePrice,primaryFullImageUrl) {
	this.displayName = ko.observable(displayName);
  this.description = ko.observable(description);
  this.id = ko.observable(id);
  this.listPrice = listPrice;
  this.salePrice = salePrice;
  this.primaryFullImageUrl = ko.observable(primaryFullImageUrl);
};
function productViewModel() {
  var self = this;
  self.products = ko.observableArray();

  self.cart = ko.observableArray();
  self.addProductToCart = function(product) {
      self.cart.push(product)
  } 
  self.cartTotal = ko.computed(function() {
  		var total = 0;
			for(var i = 0; i < self.cart().length; i++) {
      		total += self.cart()[i].salePrice;
      }
      return total;
  });
  $.getJSON("https://crossorigin.me/https://ccstore-z5ia.oracleoutsourcing.com/ccstoreui/v1/products?totalResults=true&totalExpandedResults=true&catalogId=&offset=0&limit=60&categoryId=HomePageFeatured&includeChildren=true&storePriceListGroupId=defaultPriceGroup", function(json) {
    var jsonData = JSON.stringify(json);
    var items = json.items;
    for(var i = 0; i < items.length; i += 1) {
      var imageUrl = "https://ccstore-z5ia.oracleoutsourcing.com" + items[i].primaryFullImageURL;
      self.products.push(new Product(items[i].displayName, items[i].description, items[i].id, items[i].listPrice,items[i].salePrice, imageUrl));
    }
});
}
ko.applyBindings(new productViewModel());