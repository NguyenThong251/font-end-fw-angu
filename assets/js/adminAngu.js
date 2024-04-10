// ANGULAR JS
var app = angular.module("myApp", ["ngRoute", "ngCookies"]);
app
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "admin/login.html",
      })
      .when("/login", {
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
      .when("/user", {
        templateUrl: "admin/user.html",
      })
      .when("/role", {
        templateUrl: "admin/role.html",
      })
      .when("/order", {
        templateUrl: "admin/order.html",
      })
      .when("/setting", {
        templateUrl: "admin/setting.html",
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
    $scope.loginAdmin = (email, password) => {
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
    $scope.countProduct = function () {
      if ($scope.products && $scope.products.length > 0) {
        return $scope.products.length;
      } else {
        return 0;
      }
    };
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
            $scope.categoryNew.img = base64Image;
            $scope.userNew.img = base64Image;
            $scope.roleNew.img = base64Image;
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
      // Xử lý danh sách categorys
      var categoryCounts = {};
      $scope.categorys.forEach((category) => {
        categoryCounts[category.id] = 0;
      });

      // Tiếp tục yêu cầu GET để lấy danh sách sản phẩm
      $http.get("http://localhost:3000/products").then((res) => {
        $scope.products = res.data;

        // Xử lý số lượng sản phẩm cho mỗi danh mục
        $scope.products.forEach((product) => {
          // Kiểm tra xem danh mục của sản phẩm có tồn tại trong categoryCounts không
          if (categoryCounts.hasOwnProperty(product.category)) {
            // Nếu có, tăng giá trị đếm cho danh mục đó
            categoryCounts[product.category]++;
          }
        });

        // Tạo biểu đồ cột
        var RevenueReport = {
          series: [
            {
              data: Object.values(categoryCounts),
            },
          ],
          chart: {
            type: "bar",
            height: 350,
            toolbar: {
              show: false,
            },
          },
          color: ["#198754", "#0d6efd", "#ffc107", "#dc3545;", "#64b496"],
          plotOptions: {
            bar: {
              distributed: true,
              borderRadius: 4,
              horizontal: false,
              columnWidth: "40%",
            },
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },
          xaxis: {
            categories: Object.keys(categoryCounts),
          },
        };

        // Render biểu đồ
        var chart = new ApexCharts(
          document.querySelector("#RevenueReport"),
          RevenueReport
        );
        chart.render();
      });
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
      if ($scope.products && $scope.products.length > 0) {
        return Math.ceil($scope.products.length / $scope.limit);
      } else {
        return 0; // or any default value as per your requirement
      }
    };
    $scope.totalPageCate = function () {
      if ($scope.categogys && $scope.categogys.length > 0) {
        return Math.ceil($scope.categogys.length / $scope.limit);
      } else {
        return 0; // or any default value as per your requirement
      }
    };
    // option 1
    $scope.totalListCate = function () {
      let arr = [];
      for (let i = 1; i <= $scope.totalPageCate(); i++) {
        arr.push(i);
      }
      return arr;
    };
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
    // XỬ LÍ POST CATEGORY
    $scope.categoryNew = {
      name: "",
      img: "",
      date: $scope.getCurrentDateTime(),
      status: "",
    };
    $scope.addCategory = () => {
      $http
        .post("http://localhost:3000/category", $scope.categoryNew)
        .then((res) => {
          showSuccessMessage();
        });
    };
    // XỬ LÝ PUT
    // Xử lí edit Cate
    $scope.openEditCate = function (categogy) {
      $scope.categoryNew = angular.copy(categogy);
      $scope.isEditing = true;
    };
    $scope.EditCategory = function () {
      $http
        .put(
          "http://localhost:3000/category/" + $scope.categoryNew.id,
          $scope.categoryNew
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
    $scope.logout = () => {
      sessionStorage.removeItem("currentRole");
      $scope.currentRole = null;
      // Redirect to login page
      $location.path("/login");

      // Reload the page
      // $window.location.reload();
    };
    $scope.confirmDeleteCate = function (category) {
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
          $scope.deleteCate(category);
        }
      });
    };
    $scope.deleteCate = function (category) {
      // Thực hiện gửi yêu cầu xóa sản phẩm đến máy chủ
      $http
        .delete("http://localhost:3000/category/" + category.id)
        .then(function (response) {
          // Xóa sản phẩm khỏi danh sách products
          $scope.categorys = $scope.categorys.filter(function (item) {
            return item.id !== category.id;
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
    $http.get("http://localhost:3000/user").then((res) => {
      $scope.users = res.data;
    });
    $scope.countUsers = function () {
      if ($scope.users && $scope.users.length > 0) {
        return $scope.users.length;
      } else {
        return 0;
      }
    };
    // ADD USER
    $scope.userNew = {
      name: "",
      img: "",
      email: "",
      phone: "",
      password: "",
    };
    $scope.addUserNew = () => {
      $http.post("http://localhost:3000/user", $scope.userNew);
      console.log($scope.userNew).then((res) => {
        showSuccessMessage();
      });
    };
    // EDIT USER
    $scope.openEditUser = function (user) {
      $scope.userNew = angular.copy(user);
      $scope.isEditing = true;
    };
    $scope.EditUser = function () {
      $http
        .put("http://localhost:3000/user/" + $scope.userNew.id, $scope.userNew)
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
    // XOA USER
    $scope.confirmDeleteUser = function (user) {
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
          $scope.deleteUser(user);
        }
      });
    };
    $scope.deleteUser = function (user) {
      // Thực hiện gửi yêu cầu xóa sản phẩm đến máy chủ
      $http
        .delete("http://localhost:3000/user/" + user.id)
        .then(function (response) {
          // Xóa sản phẩm khỏi danh sách products
          $scope.users = $scope.users.filter(function (item) {
            return item.id !== user.id;
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
    $scope.totalPageUser = function () {
      if ($scope.users && $scope.users.length > 0) {
        return Math.ceil($scope.users.length / $scope.limit);
      } else {
        return 0; // or any default value as per your requirement
      }
    };
    // option 1
    $scope.totalListUser = function () {
      let arr = [];
      for (let i = 1; i <= $scope.totalPageUser(); i++) {
        arr.push(i);
      }
      return arr;
    };

    // XỬ LÝ ROLE
    $http.get("http://localhost:3000/role").then((res) => {
      $scope.roles = res.data;
    });
    $scope.roleNew = {
      name: "",
      img: "",
      email: "",
      phone: "",
      password: "",
      position: "",
    };
    $scope.addRoleNew = () => {
      // console.log($scope.roleNew);
      $http.post("http://localhost:3000/role", $scope.roleNew).then((res) => {
        showSuccessMessage();
      });
    };
    // EDIT ROLE
    $scope.openEditRole = function (role) {
      $scope.roleNew = angular.copy(role);
      $scope.isEditing = true;
    };
    $scope.EditRole = function () {
      $http
        .put("http://localhost:3000/role/" + $scope.roleNew.id, $scope.roleNew)
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
    // XOA ROLE
    $scope.confirmDeleteRole = function (role) {
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
          $scope.deleteRole(role);
        }
      });
    };
    $scope.deleteRole = function (role) {
      // Thực hiện gửi yêu cầu xóa sản phẩm đến máy chủ
      $http
        .delete("http://localhost:3000/role/" + role.id)
        .then(function (response) {
          // Xóa sản phẩm khỏi danh sách products
          $scope.roles = $scope.roles.filter(function (item) {
            return item.id !== role.id;
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
    $scope.totalPageRole = function () {
      if ($scope.roles && $scope.roles.length > 0) {
        return Math.ceil($scope.roles.length / $scope.limit);
      } else {
        return 0; // or any default value as per your requirement
      }
    };
    // option 1
    $scope.totalListRole = function () {
      let arr = [];
      for (let i = 1; i <= $scope.totalPageRole(); i++) {
        arr.push(i);
      }
      return arr;
    };
    // XU LY BILL
    $http.get("http://localhost:3000/bill").then((res) => {
      $scope.bills = res.data;
    });
    $scope.getTotalAmount = function () {
      var total = 0;
      $scope.bills.forEach((item) => {
        total += item.totalAmount;
      });

      return total;
    };
    $scope.countBills = function () {
      if ($scope.bills && $scope.bills.length > 0) {
        return $scope.bills.length;
      } else {
        return 0;
      }
    };
    $scope.billdetail = function (billId) {
      // Gửi yêu cầu lấy chi tiết của hóa đơn dựa trên billId
      $http.get("http://localhost:3000/bill/" + billId).then(function (res) {
        // Gán dữ liệu hóa đơn chi tiết vào một biến
        $scope.selectedBill = res.data;
      });
    };
    //  Phan  trang bill
    $scope.totalPageBill = function () {
      if ($scope.bills && $scope.bills.length > 0) {
        return Math.ceil($scope.bills.length / $scope.limit);
      } else {
        return 0; // or any default value as per your requirement
      }
    };
    // option 1
    $scope.totalListBill = function () {
      let arr = [];
      for (let i = 1; i <= $scope.totalPageBill(); i++) {
        arr.push(i);
      }
      return arr;
    };
    // Xóa bill
    $scope.confirmDeleteBill = function (bill) {
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
          $scope.deleteBill(bill);
        }
      });
    };
    $scope.deleteBill = function (bill) {
      // Thực hiện gửi yêu cầu xóa sản phẩm đến máy chủ
      $http
        .delete("http://localhost:3000/bill/" + bill.id)
        .then(function (response) {
          // Xóa sản phẩm khỏi danh sách products
          $scope.bills = $scope.bills.filter(function (item) {
            return item.id !== bill.id;
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
    // XỬ LÍ CHART THỐNG KÊ
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
