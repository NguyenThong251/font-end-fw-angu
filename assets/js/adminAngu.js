// ANGULAR JS
var app = angular.module("myApp", ["ngRoute", "ngCookies"]);
app
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "admin/login.html",
      })
      .when("/dashboard", {
        templateUrl: "admin/dashboard.html",
      })
      .when("/product", {
        templateUrl: "admin/product.html",
      })
      .when("/addproduct", {
        templateUrl: "admin/addproduct.html",
      })
      .when("/category", {
        templateUrl: "admin/categogy.html",
      })
      .when("/addcategory", {
        templateUrl: "admin/addcategory.html",
      })
      // .otherwise({
      //   rediRectTo: "/",
      // });
      .otherwise({
        templateUrl: "admin/404.html",
      });
  })
  .controller("appCtrl", ($scope, $http, $cookies, $location, $window) => {
    // XỬ LÝ UESER
    $scope.login = () => {
      var email = $scope.email;
      var password = $scope.password;
      $http.get("http://localhost:3000/role").then((res) => {
        var role = res.data.find(
          (role) => role.email === email && role.password === password
        );
        if (role) {
          sessionStorage.setItem("currentRole", JSON.stringify(role));
          $scope.currentRole = role;
          $location.path("/dashboard");
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
    $scope.currentRole = JSON.parse(sessionStorage.getItem("currentRole"));
    // console.log($scope.currentRole)
    // xử lý silebar
    $scope.isCollapsed = false;

    $scope.toggleCollapse = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    $scope.isCategoryCollapsed = false;
    $scope.toggleCategoryCollapse = function () {
      $scope.isCategoryCollapsed = !$scope.isCategoryCollapsed;
    };
    // XỬ LÝ SHOW PRODUCT
    $http.get("http://localhost:3000/products").then((res) => {
      $scope.products = res.data;
    });
    // xử lí thời gian
    $scope.getCurrentDateTime = function () {
      var now = new Date();
      var localDatetimeString = now.toLocaleString("en-US", {
        timeZone: "Asia/Ho_Chi_Minh",
      });
      return new Date(localDatetimeString);
    };
    // xử lí thêm sản phẩm
    // hàm success
    function showSuccessMessage() {
      swal({
        title: "Thành công",
        text: "Sản phẩm đã thêm vào giỏ hàng",
        icon: "success",
        button: "Tiếp tục",
      });
    }
    $scope.productNew = {
      name: "",
      pricenew: "",
      brand: "",
      quantity: "",
      priceold: "",
      img: "",
      category: "",
      status: "",
      hot: false,
      thumbnail: [],
      des: "",
      dateCreate: $scope.getCurrentDateTime(),
    };
    $scope.updateCategory = function (category) {
      $scope.productNew.category = category.id;
    };
    $scope.updatebrand = function (brand) {
      $scope.productNew.brand = brand.id;
    };
    $scope.uploadImage = function (input) {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function () {
          const base64Image = reader.result;
          console.log(base64Image);
          $scope.$apply(function () {
            $scope.productNew.img = base64Image;
          });
        };
        reader.readAsDataURL(file);
      }
    };
    $scope.previewImages = function (input) {
      if (input.files) {
        for (var i = 0; i < input.files.length; i++) {
          const reader = new FileReader();
          reader.onload = function () {
            const base64Image = reader.result;
            $scope.$apply(function () {
              $scope.productNew.thumbnail.push(base64Image);
            });
          };
          reader.readAsDataURL(input.files[i]);
        }
      }
    };
    $scope.deleteThumbnail = function (index) {
      $scope.productNew.thumbnail.splice(index, 1);
    };
    $scope.productOffer = 0;
    $scope.addProduct = (x) => {
      if (x === 0) {
        $scope.productNew.priceold = "";
      } else {
        var discountPercentage = x / 100;
        var discountedAmount = $scope.productNew.pricenew * discountPercentage;
        $scope.productNew.priceold = $scope.productNew.pricenew;

        $scope.productNew.pricenew =
          $scope.productNew.pricenew - discountedAmount;
      }
      $http
        .post("http://localhost:3000/products", $scope.productNew)
        .then((res) => {
          console.log("Success");
          showSuccessMessage();
        });
      showSuccessMessage();
    };
    // XỬ LÍ SHOW CATEGORY
    $http.get("http://localhost:3000/category").then((res) => {
      $scope.categorys = res.data;
    });
    // XỬ LÍ SHOW CATEGORY
    $http.get("http://localhost:3000/brand").then((res) => {
      $scope.brands = res.data;
    });
    // modelview product
    $scope.isModalOpen = false; // Biến để kiểm tra xem modal có đang mở hay không
    $scope.selectedProduct = {}; // Biến để lưu trữ thông tin sản phẩm được chọn

    $scope.openModal = function (product) {
      $scope.selectedProduct = product; // Gán thông tin sản phẩm được chọn vào biến selectedProduct
      $scope.isModalOpen = true; // Mở modal
    };

    $scope.changeMainImage = function (imageUrl) {
      $scope.selectedProduct.img = imageUrl;
    };
    $scope.closeModal = function () {
      $scope.isModalOpen = false; // Đóng modal
    };
    // Xử lí edit product
    $scope.openEditPro = function (product) {
      $scope.productNew = angular.copy(product);
      $scope.isEditing = true;
    };
    $scope.editProduct = function (offer) {
      if (!isValidProduct($scope.productNew)) {
        // Hiển thị thông báo lỗi nếu dữ liệu không hợp lệ
        swal({
          title: "Lỗi",
          text: "Dữ liệu sản phẩm không hợp lệ. Vui lòng kiểm tra lại",
          icon: "error",
          buttons: {
            confirm: {
              text: "OK",
              className: "btn btn-danger text-white", // Class cho nút Đồng ý
            },
          },
        });
        return; // Dừng việc gửi dữ liệu nếu dữ liệu không hợp lệ
      } // Gửi dữ liệu cập nhật lên máy chủ
      // Tính toán giá sản phẩm mới và giá cũ dựa trên giảm giá
      var discountPercentage = offer / 100;
      var discountedAmount = $scope.productNew.pricenew * discountPercentage;
      console.log($scope.productNew);
      $scope.productNew.priceold = $scope.productNew.pricenew;
      $scope.productNew.pricenew =
        $scope.productNew.pricenew - discountedAmount;
      $http
        .put(
          "http://localhost:3000/products/" + $scope.productNew.id,
          $scope.productNew
        )
        .then(function (response) {
          // Xử lý khi cập nhật thành công
          swal({
            title: "Thành công",
            text: "Sản phẩm đã được cập nhật thành công",
            icon: "success",
            buttons: {
              confirm: {
                text: "OK",
                className: "btn btn-primary text-white", // Class cho nút Đồng ý
              },
            },
          });

          // Sau khi cập nhật thành công, xóa nội dung form hoặc đóng modal
          clearForm(); // Hoặc closeModal();
        })
        .catch(function (error) {
          // Xử lý khi có lỗi xảy ra trong quá trình cập nhật
          swal({
            title: "Lỗi",
            text: "Đã có lỗi xảy ra. Vui lòng thử lại sau",
            icon: "error",
            buttons: {
              confirm: {
                text: "OK",
                className: "btn btn-danger text-white", // Class cho nút Đồng ý
              },
            },
          });
        });
    };
    // Hàm kiểm tra dữ liệu sản phẩm
    function isValidProduct(product) {
      // Thực hiện kiểm tra dữ liệu ở đây
      // Trả về true nếu dữ liệu hợp lệ, ngược lại trả về false
      // Ví dụ: Kiểm tra xem các trường bắt buộc đã được điền đầy đủ hay chưa
      return (
        product.name &&
        product.quantity &&
        product.pricenew &&
        product.category &&
        product.status !== undefined
      );
    }

    // Hàm xóa nội dung form sau khi cập nhật thành công
    function clearForm() {
      // Xóa nội dung của các trường trong form hoặc thiết lập các giá trị mặc định
      $scope.productNew = {
        name: "",
        pricenew: "",
        brand: "",
        quantity: "",
        priceold: "",
        img: "",
        category: "",
        status: "",
        hot: false,
        thumbnail: [],
        des: "",
        dateCreate: $scope.getCurrentDateTime(),
      };
      // Đóng modal nếu đang mở
      $scope.isEditing = false;
    }
    $scope.confirmDelete = function (product) {
      // Sử dụng hộp thoại xác nhận của Bootstrap
      swal({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "Sau khi xóa, bạn sẽ không thể khôi phục lại dữ liệu!",
        icon: "warning",
        buttons: {
          cancel: "Hủy",
          confirm: {
            text: "Xóa",
            className: "btn-danger",
          },
        },
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          // Nếu người dùng xác nhận xóa
          // Gọi hàm deleteProduct để xóa sản phẩm
          $scope.deleteProduct(product);
        }
      });
    };
    $scope.deleteProduct = function (product) {
      // Thực hiện gửi yêu cầu xóa sản phẩm đến máy chủ
      $http
        .delete("http://localhost:3000/products/" + product.id)
        .then(function (response) {
          // Xóa sản phẩm khỏi danh sách products
          $scope.products = $scope.products.filter(function (item) {
            return item.id !== product.id;
          });

          // Hiển thị thông báo thành công
          swal("Thành công", "Sản phẩm đã được xóa thành công!", "success");
        })
        .catch(function (error) {
          // Xử lý lỗi nếu có
          console.error("Error deleting product: ", error);
          swal(
            "Lỗi",
            "Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại sau.",
            "error"
          );
        });
    };
    // XỬ LSI PHÂN TRANG
    $scope.limit = 12;
    $scope.page = 1;
    $scope.begin = ($scope.page - 1) * $scope.limit;
    $scope.chuyentrang = (trang) => {
      $scope.page = trang;
      $scope.begin = ($scope.page - 1) * $scope.limit;
      // if (Number.isInteger(trang)) {
      //   $scope.page = trang;
      // }
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
  })
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
      } else {
        kq = input;
      }
      return kq;
    };
  });
