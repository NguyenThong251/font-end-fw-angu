var app = angular.module("myApp", ["ngRoute", "ngCookies"]);
app
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "view/home.html?" + Math.random(),
        // controller: "homeCtrl",
      })
      .when("/shop", {
        templateUrl: "view/shop.html",
        // controller: "shopCtrl",
      })
      .when("/blog", {
        templateUrl: "view/blog.html",
        controller: "blogCtrl",
      })
      .when("/contact", {
        templateUrl: "view/contact.html",
        controller: "contactCtrl",
      })
      .when("/about", {
        templateUrl: "view/about.html",
        controller: "aboutCtrl",
      })
      .when("/wishlist", {
        templateUrl: "view/wishlist.html",
        // controller: "wishlistCtrl",
      })
      .when("/viewcart", {
        templateUrl: "view/viewcart.html?" + Math.random(),
        // controller: "viewcartCtrl",
      })
      .when("/checkout", {
        templateUrl: "view/checkout.html",
        // controller: "checkoutCtrl",
      })
      .when("/login", {
        templateUrl: "view/login.html?" + Math.random(),
        controller: "loginCtrl",
      })
      .when("/signup", {
        templateUrl: "view/signup.html",
        controller: "signupCtrl",
      })
      .when("/setting", {
        templateUrl: "view/dashboard.html",
        controller: "settingCtrl",
      })
      .when("/forgot", {
        // templateUrl: "view/forgotpass.html",
        // controller: "forgotCtrl",
      })
      .when("/detail/:id", {
        templateUrl: "view/detail.html?" + Math.random(),
        controller: "detailCtrl",
      })
      .when("/blogdetail", {
        templateUrl: "view/blogdetail.html",
        controller: "blogdetailCtrl",
      })
      .when("/order", {
        templateUrl: "view/order.html",
      })

      // .otherwise({
      //   rediRectTo: "/",
      // });
      .otherwise({
        templateUrl: "view/404.html",
      });
  })
  // XU LY HOME
  .controller(
    "appCtrl",
    function ($scope, $http, $cookies, $location, $window) {
      //category
      $scope.categories = [];
      $scope.products = [];
      $http.get("http://localhost:3000/category").then(
        function (res) {
          $scope.categories = res.data;
          $scope.activeCategoryId = "all";
        },
        function (error) {
          alert("loi");
        }
      );

      // $scope.categories = categories;
      // product
      $http.get("http://localhost:3000/products").then(
        function (res) {
          $scope.products = res.data;
          $scope.filteredCategoryId = "all"; // khoi tao bo loc
          $scope.products.forEach((element) => {
            // xu li sale
            var discountPercentage =
              ((element.priceold - element.pricenew) / element.priceold) * 100;
            element.isSale = discountPercentage > 20;
            // xu li category name
            var category = $scope.categories.find((cat) => {
              // return cat.id === element.category;
              return parseInt(cat.id) === parseInt(element.category);
            });
            if (category) {
              element.categoryName = category.name;
            }
          });
          // updateProductCounts();
        },
        function (error) {
          alert("loi");
        }
      );
      // Xử lí số lượng sản phẩm cho mỗi loại
      // function updateProductCounts() {
      //   $scope.categories.forEach(function (category) {
      //     category.countPro = countProductsByCategory(category.id);
      //   });
      // }
      // Hàm đếm số lượng sản phẩm cho mỗi loại
      $scope.countProductsByCategory = function (categoryId) {
        var count = 0;
        angular.forEach($scope.products, function (product) {
          if (product.category === parseInt(categoryId)) {
            count++;
          }
        });
        return count;
      };
      $scope.countProductsAllCategories = function () {
        var totalCount = 0;
        angular.forEach($scope.categories, function (category) {
          totalCount += $scope.countProductsByCategory(category.id);
        });
        return totalCount;
      };
      // Xử lí bộ lọc user

      //xử lí bộ lọc
      $scope.selectedCategories = {};
      $scope.filterHotProduct = function (product) {
        return product.hot === true;
      };
      $scope.filterProductsByCategory = function (categoryId) {
        if (categoryId === "all") {
          $scope.filteredCategoryId = "all"; // Đảm bảo rằng nếu bạn muốn hiển thị tất cả các sản phẩm, 'all' vẫn là chuỗi
        } else {
          $scope.filteredCategoryId = parseInt(categoryId); // Chuyển đổi categoryId thành số nguyên
        }
      };
      $scope.resetCheckboxes = function () {
        $scope.selectedCategories = {};
        $scope.filteredCategoryId = "all";
      };
      // Filter function for ng-repeat shop
      $scope.categoryFilterShop = function (product) {
        if ($scope.filteredCategoryId === "all") {
          return true; // Hiển thị tất cả sản phẩm nếu chọn All
        } else {
          return $scope.selectedCategories[product.category];
          // return product.category === $scope.filteredCategoryId; // Lọc sản phẩm theo categoryId
        }
      };
      // category header filter
      // $scope.filterProductsAndRedirect = function (categoryId) {
      //   $scope.filterProductsByCategory(categoryId); // Lọc sản phẩm theo categoryId
      //   $location.path("/shop"); // Điều hướng người dùng đến trang "shop"
      // };
      // Filter function for ng-repeat
      $scope.categoryFilter = function (product) {
        if ($scope.filteredCategoryId === "all") {
          return true; // Hiển thị tất cả sản phẩm nếu chọn All
        } else {
          // return $scope.selectedCategories[product.category];
          return product.category === $scope.filteredCategoryId; // Lọc sản phẩm theo categoryId
        }
      };
      // modelview product
      $scope.isModalOpen = false; // Biến để kiểm tra xem modal có đang mở hay không
      $scope.selectedProduct = {}; // Biến để lưu trữ thông tin sản phẩm được chọn

      $scope.openModal = function (product) {
        $scope.selectedProduct = product; // Gán thông tin sản phẩm được chọn vào biến selectedProduct
        $scope.isModalOpen = true; // Mở modal
      };

      $scope.closeModal = function () {
        $scope.isModalOpen = false; // Đóng modal
      };
      // $scope.products = products;
      // user
      $http.get("http://localhost:3000/user").then(
        function (res) {
          $scope.users = res.data;
        },
        function (error) {
          alert("loi");
        }
      );
      // xử lí bộ lọc user
      $scope.userFilter = function (user) {
        return user.img !== "" && user.comment !== "";
      };
      // xử lý số lượng model
      // XỬ LÍ GIỎ HÀNG DETAIL MODAL
      $scope.quantity = 1;
      $scope.plusQuantitymodal = function () {
        $scope.quantity++;
      };
      $scope.minusQuantitymodal = function () {
        if ($scope.quantity > 1) {
          $scope.quantity--;
        }
      };
      $scope.addCartFromModal = function (product) {
        var cartProduct = angular.copy(product); // Tạo một bản sao của sản phẩm để tránh ảnh hưởng đến dữ liệu gốc
        cartProduct.quantity = $scope.quantity; // Gán số lượng được chọn cho sản phẩm
        if ($scope.cart.filter((i) => i.id == cartProduct.id).length == 0) {
          $scope.cart.push(cartProduct); // Thêm sản phẩm vào giỏ hàng nếu chưa tồn tại
        } else {
          $scope.cart.forEach((i) => {
            if (i.id == cartProduct.id) {
              i.quantity += $scope.quantity; // Tăng số lượng nếu sản phẩm đã tồn tại trong giỏ hàng
            }
          });
        }
        $cookies.putObject("cart", $scope.cart);
        showSuccessMessage();
        $scope.totalQuantity();
      };
      // XỬ LÍ GIỎ HÀNG DETAIL MODAL END
      // XỬ LÍ GIỎ HÀNG
      // $scope.cart = [];
      if ($cookies.getObject("cart")) {
        $scope.cart = $cookies.getObject("cart");
      } else {
        $scope.cart = [];
      }

      function showSuccessMessage() {
        swal({
          title: "Thành công",
          text: "Sản phẩm đã thêm vào giỏ hàng",
          icon: "success",
          button: "Tiếp tục",
        });
      }
      $scope.addCart = function (product) {
        if ($scope.cart.filter((i) => i.id == product.id).length == 0) {
          product.quantity = 1;
          $scope.cart.push(product);
          showSuccessMessage();
        } else {
          $scope.cart.forEach((i) => {
            if (i.id == product.id) {
              i.quantity++;
              showSuccessMessage();
            }
          });
        }
        $cookies.putObject("cart", $scope.cart);
      };
      $scope.totalQuantity = function () {
        return $scope.cart.reduce(
          (total, item) => total + item.quantity * item.pricenew,
          0
        );
      };
      $scope.totalPriceForItem = function (item) {
        return item.quantity * item.pricenew;
      };
      $scope.removeFromCart = function () {
        $scope.cart.splice(index, 1);
        $scope.updateTotalAmount();
      };
      $scope.removeFromCart = function (item) {
        var index = $scope.cart.indexOf(item);
        if (index !== -1) {
          $scope.cart.splice(index, 1);
          $cookies.putObject("cart", $scope.cart);
        }
      };
      $scope.clearCart = function () {
        $scope.cart = [];
        $cookies.remove("cart");
      };
      $scope.minusQuantity = function (item) {
        if (item.quantity > 1) {
          item.quantity--;
          $cookies.putObject("cart", $scope.cart);
        }
      };

      $scope.plusQuantity = function (item) {
        item.quantity++;
        $cookies.putObject("cart", $scope.cart);
      };
      $scope.totalUniqueProducts = function () {
        return $scope.cart.length;
      };
      // XỬ LÍ GIỎ HÀNG END
      //  XỬ LÍ CHECKOUT
      // xử lí delivery
      $scope.deliveryRate = 35000;
      $scope.isFreeShipping = false;

      $scope.applyDelivery = function () {
        return $scope.isFreeShipping ? 0 : $scope.deliveryRate;
      };

      $scope.updateDeliveryRate = function (isFreeShipping) {
        $scope.isFreeShipping = isFreeShipping;
        $scope.deliveryRate = isFreeShipping ? 0 : 35000;
      };
      // Xử lí voucher
      // $scope.voucherCode = "";
      $http.get("http://localhost:3000/voucher").then(function (response) {
        var vouchers = response.data;
        localStorage.setItem("vouchers", JSON.stringify(vouchers)); // Lưu trữ dữ liệu vào localStorage
        $scope.vouchers = JSON.parse(localStorage.getItem("vouchers")) || [];
      });
      $scope.appliedVoucherPrice = 0;
      $scope.applyVoucher = function (voucherCode) {
        if (!voucherCode) {
          $scope.appliedVoucherPrice = 0;
          return; // Kết thúc hàm nếu voucherCode không có giá trị
        }
        var applyVoucher = $scope.vouchers.find(function (voucher) {
          return voucher.code === voucherCode;
        });
        if (applyVoucher) {
          $scope.appliedVoucherPrice = applyVoucher.pricesale;
          swal({
            title: "Thành công",
            text: "Voucher của bạn đã được áp dụng",
            icon: "success",
            button: "Tiếp tục",
          });
        } else {
          $scope.appliedVoucherPrice = 0;
          swal({
            title: "Thất bại",
            text: "Voucher của bạn không sử dụng được",
            icon: "error",
            button: "Tiếp tục",
          });
        }
      };

      // xử lí thông tin người dùng
      $http.get("tinh.json").then(
        function (res) {
          // console.log(res);
          $scope.dsTinh = res.data;
        },
        function (res) {
          alert("Lỗi không tải được dữ liệu json");
        }
      );
      // xử lí giá all
      $scope.totalAll = function () {
        var subtotalAll =
          $scope.totalQuantity() -
          $scope.appliedVoucherPrice +
          $scope.applyDelivery();
        return subtotalAll;
      };
      // $scope.getTotalAmountAsInteger = function () {
      //   return parseInt($scope.totalAll());
      //   // console.log(parseInt($scope.totalAll()));
      // };
      $scope.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      $scope.currentUserGoogle = JSON.parse(
        sessionStorage.getItem("user-google")
      );
      // xử lí thời gian
      $scope.getCurrentDateTime = function () {
        var now = new Date();
        var localDatetimeString = now.toLocaleString("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
        });
        return new Date(localDatetimeString);
      };
      $scope.bill = {
        userId: $scope.currentUser ? $scope.currentUser.id : null,
        userUId: $scope.currentUserGoogle ? $scope.currentUserGoogle.uid : null,
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        tinh: "",
        huyen: "",
        phuong: "",
        zip: "",
        phoneNumber: "",
        fullnameRec: "",
        tinhRec: "",
        huyenRec: "",
        phuongRec: "",
        phonenumberRec: "",
        date: $scope.getCurrentDateTime(),
        note: "",
        totalAmount: $scope.totalAll(),
        cartItems: [],
      };

      $scope.cart.forEach(function (item) {
        var newItem = {
          name: item.name,
          quantity: item.quantity,
        };
        $scope.bill.cartItems.push(newItem);
      });

      $scope.updateTinhName = function (selectedTinh) {
        $scope.bill.tinh = selectedTinh.Name;
      };
      $scope.updateHuyenName = function (selectedHuyen) {
        $scope.bill.huyen = selectedHuyen.Name;
      };
      $scope.updatePhuongName = function (selectedPhuong) {
        $scope.bill.phuong = selectedPhuong.Name;
      };
      // rec
      $scope.updateTinhRecName = function (selectedTinh) {
        $scope.bill.tinhRec = selectedTinh.Name;
        console.log(selectedTinh.Name);
      };
      $scope.updateHuyenRecName = function (selectedHuyen) {
        $scope.bill.huyenRec = selectedHuyen.Name;
        console.log(selectedHuyen.Name);
      };
      $scope.updatePhuongRecName = function (selectedPhuong) {
        $scope.bill.phuongRec = selectedPhuong.Name;
        console.log(selectedPhuong.Name);
      };
      // Gửi về mail
      function sendEmail(bill) {
        // Lấy thông tin từ hóa đơn và thêm vào mẫu email
        var templateParams = {
          name: bill.firstName + " " + bill.lastName,
          email: bill.email,
          address: bill.address,
          addressdetail: bill.tinh + " " + bill.huyen + " " + bill.phuong,
          zip: bill.zip,
          phoneNumber: bill.phoneNumber,
          fullnameRec: bill.fullnameRec,
          addressRec: bill.tinhRec + " " + bill.huyenRec + " " + bill.phuongRec,
          phonenumberRec: bill.phonenumberRec,
          date: bill.date,
          note: bill.note,
          totalAmount: bill.totalAmount,
          cartItems: ":",
          // Thêm các thông tin khác tùy thuộc vào yêu cầu của bạn
        }; // Gửi yêu cầu gửi email thông qua EmailJS
        bill.cartItems.forEach(function (item) {
          templateParams.cartItems += item.name + " x " + item.quantity + ", ";
        });

        // console.log(templateParams);
        emailjs
          .send("service_v1lfxr7", "template_0ehyqm7", templateParams)
          .then(
            function (response) {
              console.log("Email sent successfully:", response);
            },
            function (error) {
              console.error("Error sending email:", error);
            }
          );
      }

      $scope.placeOrder = function () {
        $scope.bill.totalAmount = $scope.totalAll();
        $scope.bill.cartItems = [];
        $scope.cart.forEach(function (item) {
          var newItem = {
            name: item.name,
            quantity: item.quantity,
          };
          $scope.bill.cartItems.push(newItem);
        });
        // Lặp qua từng sản phẩm trong cartItems và thêm thông tin vào templateParams

        sendEmail($scope.bill);

        setTimeout(function () {
          $http
            .post("http://localhost:3000/bill", $scope.bill)
            .then(function (res) {
              console.log("Success");
              $location.path("/"); // Chuyển hướng sau khi gửi yêu cầu thành công
              $scope.cart = []; // Xoá giỏ hàng
              $cookies.remove("cart"); // Xoá cookie
              // $cookies.putObject("bill", $scope.bill);
              // sessionStorage.setItem("bill", JSON.stringify($scope.bill));
            })
            .catch(function (error) {
              console.error("Error:", error);
            });
        }, 5000); // Chậm trễ 3 giây
      };

      //  ORDER
      if ($scope.currentUser || $scope.currentUserGoogle) {
        $http.get("http://localhost:3000/bill").then((res) => {
          $scope.bills = res.data;
          // console.log($scope.bills);
        });
      } else {
        var cookiesBill = $cookies.getObject("bill");
        if (cookiesBill) {
          $scope.bills = [cookiesBill];
        } else {
          $scope.bills = [];
        }
      }
      $scope.billdetail = function (billId) {
        // Gửi yêu cầu lấy chi tiết của hóa đơn dựa trên billId
        $http.get("http://localhost:3000/bill/" + billId).then(function (res) {
          // Gán dữ liệu hóa đơn chi tiết vào một biến
          $scope.selectedBill = res.data;
        });
      };
      //  XỬ LÍ CHECKOUT END
      // XỬ LÍ CHECK USER
      $scope.currentUserGoogle = JSON.parse(
        sessionStorage.getItem("user-google")
      );
      // console.log($scope.currentUserGoogle);
      $scope.logout = function () {
        sessionStorage.removeItem("currentUser");
        $scope.currentUser = null;
        sessionStorage.removeItem("user-google");
        // Redirect to login page or any other desired page
        $window.location.reload();
        $location.path("/");
      };

      $scope.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      // XỬ LÍ CHECK USER END
      // XỬ LÍ SHOP PHAN TRANG

      $scope.limit = 12;
      $scope.page = 1;
      $scope.begin = ($scope.page - 1) * $scope.limit;
      $scope.chuyentrang = (trang) => {
        $scope.page = trang;
        $scope.begin = ($scope.page - 1) * $scope.limit;
      };
      $scope.totalPage = function () {
        return Math.ceil($scope.products.length / $scope.limit);
      };
      // option 1
      // $scope.totalList = function () {
      //   let arr = [];
      //   for (let i = 1; i <= $scope.totalPage(); i++) {
      //     arr.push(i);
      //   }
      //   return arr;
      // };
      // option 2
      $scope.totalList = () => {
        let arr = [];
        let currentPage = $scope.page;
        let totalPages = $scope.totalPage();
        let maxPagesToShow = 2;
        // hiển thị ... nếu nó lơn hơn maxPages
        let showDots = totalPages > maxPagesToShow;
        // tinh toán vị trí bắt đầu kết thúc
        let startPage, endPage;
        if (!showDots) {
          startPage = 1;
          endPage = totalPages;
        } else {
          let halfPagesToShow = Math.floor(maxPagesToShow / 2);
          if (currentPage <= halfPagesToShow) {
            startPage = 1;
            endPage = maxPagesToShow;
          } else if (currentPage + halfPagesToShow >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
          } else {
            startPage = currentPage - halfPagesToShow;
            endPage = currentPage + halfPagesToShow;
          }
        }
        // thêm các trang vào danh sách
        for (let i = startPage; i <= endPage; i++) {
          arr.push(i);
        }
        // Thêm dấu '...' nếu cần
        if (showDots) {
          if (startPage > 1) {
            arr.unshift("...");
          }
          if (endPage < totalPages) {
            arr.push("...");
          }
        }
        return arr;
      };
      // XỬ LÍ SHOP PHAN TRANG END
      //  XỬ LÍ XEM THÊM SẢN PHẨM
      $scope.loadMore = () => {
        $scope.limit += 12;
      };
      //  XU LI WISHLIST
      $scope.isWishlistActive = function (product) {
        var found = $scope.wishlistItems.find(function (item) {
          return item.id === product.id;
        });

        if (found !== undefined) {
          return true; // Nếu sản phẩm có trong danh sách mong muốn, trả về true
        } else {
          return false; // Nếu sản phẩm không có trong danh sách mong muốn, trả về false
        }
      };

      $scope.wishlistItems =
        JSON.parse(sessionStorage.getItem("wishlistItems")) || [];

      $scope.wishlist = function (product) {
        var foundIndex = $scope.wishlistItems.findIndex(function (item) {
          return item.id === product.id;
        });

        if (foundIndex === -1) {
          $scope.wishlistItems.push(product);
        } else {
          $scope.wishlistItems.splice(foundIndex, 1);
        }

        // Lưu trữ dữ liệu vào sessionStorage
        sessionStorage.setItem(
          "wishlistItems",
          JSON.stringify($scope.wishlistItems)
        );
      };
    }
  )

  //   XU LI CHI TIET SAN PHAM
  .controller("detailCtrl", function ($scope, $routeParams, $cookies) {
    $scope.wishlistItems =
      JSON.parse(sessionStorage.getItem("wishlistItems")) || [];

    $scope.wishlist = function (product) {
      var foundIndex = $scope.wishlistItems.findIndex(function (item) {
        return item.id === product.id;
      });

      if (foundIndex === -1) {
        $scope.wishlistItems.push(product);
      } else {
        $scope.wishlistItems.splice(foundIndex, 1);
      }

      // Lưu trữ dữ liệu vào sessionStorage
      sessionStorage.setItem(
        "wishlistItems",
        JSON.stringify($scope.wishlistItems)
      );
    };
    $scope.id = $routeParams.id;
    $scope.products = $scope.products.filter((i) => i.id == $scope.id)[0];
    $scope.changeMainImage = function (imageUrl) {
      $scope.products.img = imageUrl;
    };
    $scope.quantity = 1;
    $scope.plusQuantity = function () {
      $scope.quantity++;
    };
    $scope.minusQuantity = function () {
      if ($scope.quantity > 1) {
        $scope.quantity--;
      }
    };
    /// add cart
    // Hàm để thêm sản phẩm vào giỏ hàng
    function showSuccessMessage() {
      swal({
        title: "Thành công",
        text: "Sản phẩm đã thêm vào giỏ hàng",
        icon: "success",
        button: "Tiếp tục",
      });
    }

    $scope.addToCart = function (product) {
      var cartProduct = angular.copy(product);
      cartProduct.quantity = $scope.quantity;
      if ($scope.cart.filter((i) => i.id == cartProduct.id).length == 0) {
        $scope.cart.push(cartProduct);
      } else {
        $scope.cart.forEach((i) => {
          if (i.id == cartProduct.id) {
            i.quantity += $scope.quantity;
          }
        });
      }
      $cookies.putObject("cart", $scope.cart);
      showSuccessMessage();
    };
  })
  // SIGNUP
  .controller("signupCtrl", function ($scope, $routeParams, $http, $location) {
    $scope.user = {
      name: "",
      img: "",
      comment: "",
      rate: "",
      email: "",
      phone: "",
      address: "",
      password: "",
    };
    $scope.success = () => {
      $http
        .get("http://localhost:3000/user?email=" + $scope.user.email)
        .then(function (res) {
          if (res.data.length > 0) {
            swal({
              title: "Lỗi",
              text: "Email đã tồn tại trong hệ thống.",
              icon: "error",
              buttons: {
                confirm: {
                  text: "Quay lại",
                  className: "btn btn-danger text-white", // Class cho nút Đăng nhập
                },
              },
            });
          } else {
            swal({
              title: "Chúc mừng",
              text: "Bạn đã đăng kí thành công",
              icon: "success",
              buttons: {
                confirm: {
                  text: "Đăng nhập",
                  className: "btn btn-primary text-white", // Class cho nút Đăng nhập
                  closeModal: true,
                },
              },
              closeOnClickOutside: false, // Ngăn người dùng bấm ra ngoài modal để đóng
              allowOutsideClick: false, // Tương tự như closeOnClickOutside
            }).then((value) => {
              if (value) {
                $scope.signup();
                // Thực hiện chuyển hướng đến trang đăng nhập
              }
            });
          }
        });
    };

    $scope.signup = () => {
      $http
        .post("http://localhost:3000/user", $scope.user)
        .then(function (res) {
          console.log(res);
          $location.path("login");
          // Hiển thị modal thông báo thành công
        });
    };
  })
  //  LOGIN
  .controller("loginCtrl", function ($scope, $location, $http, $window) {
    $scope.login = () => {
      var email = $scope.email;
      var password = $scope.password;
      $http.get("http://localhost:3000/user").then((res) => {
        var user = res.data.find(
          (user) => user.email === email && user.password === password
        );
        if (user) {
          sessionStorage.removeItem("user-google");
          sessionStorage.setItem("currentUser", JSON.stringify(user));
          // $scope.currentUser = user;

          $scope.currentUser = user;

          $location.path("/");
          swal({
            title: "Chúc mừng",
            text: "Bạn đã đăng nhập thành công",
            icon: "success",
            buttons: {
              confirm: {
                text: "Tiếp tục",
                className: "btn btn-primary text-white", // Class cho nút Đăng nhập
              },
            },
            closeOnClickOutside: false,
          }).then((res) => {
            if (res) {
              $window.location.reload();
            }
          });
          // Lưu đối tượng người dùng vào sessionStorage

          // Thực hiện các hành động cần thiết khi đăng nhập thành công
          // Ví dụ: chuyển hướng đến trang chính
        } else {
          // Nếu không tồn tại người dùng, đăng nhập thất bại
          // Hiển thị thông báo lỗi
          swal({
            title: "Lỗi",
            text: "Email hoặc mật khẩu không chính xác. Vui lòng thử lại",
            icon: "error",
            buttons: {
              confirm: {
                text: "Quay lại",
                className: "btn btn-danger text-white", // Class cho nút Đăng nhập
              },
            },
          });
        }
      });
    };
    // đăng nhập gg bằng firebase
  })
  // LOADING
  .run(function ($rootScope, $timeout) {
    $rootScope.$on("$routeChangeStart", function () {
      $rootScope.isLoading = true;
    });
    $rootScope.$on("$routeChangeSuccess", function () {
      $rootScope.isLoading = false;
    });
    $rootScope.$on("$routeChangeError", function () {
      $rootScope.isLoading = false;
      swal({
        title: "Page error",
        text: "Check the path again!",
        icon: "error",
        button: "Reload!",
      });
    });
  })
  // CUSTOM FILTER SEARCH
  // .filter("search", () => {
  //   return (input, keyword, atrr) => {
  //     let kq = [];
  //     if (keyword) {
  //       atrr.forEach((element) => {
  //         keyword = keyword.toLowerCase();
  //         let tmp = input.filter((item) => {
  //           return (
  //             item[element].toString().toLowerCase().indexOf(keyword) !== -1
  //           );
  //         });
  //         kq.push(...tmp);
  //       });
  //     } else {
  //       kq = input;
  //     }
  //     return kq;
  //   };
  // });
  .filter("search", () => {
    return (input, keyword, atrr) => {
      let kq = [];
      if (keyword) {
        atrr.forEach((element) => {
          keyword = keyword.toLowerCase();
          let tmp = input.filter((item) => {
            return (
              item[element].toString().toLowerCase().indexOf(keyword) !== -1
            );
          });
          kq.push(...tmp);
        });
      }
      return kq;
    };
  });
