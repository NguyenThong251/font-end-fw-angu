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
        templateUrl: "admin/category.html",
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
    // xử lí user
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
    console.log($scope.currentRole);
  });
