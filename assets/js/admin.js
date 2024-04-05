function toggleSubMenu(subMenuId) {
  const subMenu = document.getElementById(subMenuId);
  subMenu.classList.toggle("d-none");
}
// -------------------------------------
// admin
var RevenueReport = {
  series: [
    {
      data: [10, 8, 6, 4, 2],
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
    categories: ["Rau", "Banh", "Hat", "Gao", "Quan ao"],
  },
};

var chart = new ApexCharts(
  document.querySelector("#RevenueReport"),
  RevenueReport
);
chart.render();
// Earning
var Earning = {
  series: [
    {
      name: "Purchase Orders",

      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "Sales Orders",

      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ],
  chart: {
    height: 350,
    type: "area",
    toolbar: {
      show: false,
    },
  },
  color: ["#198754", "#0d6efd"],
  stroke: {
    curve: "smooth",
  },
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  markers: {
    size: 0,
  },
  yaxis: [
    {
      title: {
        text: "Purchase Orders",
      },
    },
    {
      opposite: true,
      title: {
        text: "Sales Orders",
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
  },
};

var Earning = new ApexCharts(document.querySelector("#Earning"), Earning);
Earning.render();
// Visitor
var Visitor = {
  series: [50, 60, 70, 60, 90],
  chart: {
    width: 380,
    type: "polarArea",
  },
  labels: ["Giay", "Dep", "Quan", "Ao", "Do"],
  fill: {
    opacity: 1,
  },
  colors: ["#a5f3d4", "#93f0cb", "#81eec2", "#3ae4a0", "#5de9b1"], // Chỉnh sửa màu ở đây
  stroke: {
    width: 1,
    colors: undefined,
  },
  yaxis: {
    show: false,
  },
  legend: {
    position: "bottom",
  },
  plotOptions: {
    polarArea: {
      rings: {
        strokeWidth: 0,
      },
      spokes: {
        strokeWidth: 0,
      },
    },
  },
  // theme: {
  //   monochrome: {
  //     enabled: true,
  //     shadeTo: "light",
  //     shadeIntensity: 0.6,
  //   },
  // },
};

var Visitor = new ApexCharts(document.querySelector("#Visitor"), Visitor);
Visitor.render();
// CK EDIT

ClassicEditor.create(document.querySelector("#editor")).catch((error) => {
  console.error(error);
});
//
// ANGULAR JS
var app = angular.module("myApp", ["ngRoute", "ngCookies"]);
app.config(function ($routeProvider) {
  $routeProvider
    .when("/admin", {
      templateUrl: "admin/admin.html?" + Math.random(),
      // controller: "homeCtrl",
    })
    // .otherwise({
    //   rediRectTo: "/",
    // });
    .otherwise({
      templateUrl: "view/404.html",
    });
});
