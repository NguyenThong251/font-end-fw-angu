$(document).ready(function () {
  $("#banner-product").owlCarousel({
    autoPlay: 5000, //Set AutoPlay to 3 seconds
    pagination: false, // ẩn nút next prev
    items: 3,
    itemsDesktop: [1199, 2],
    itemsDesktopSmall: [979, 2],
  });
});
$(document).ready(function () {
  $("#service").owlCarousel({
    autoPlay: 5000, //Set AutoPlay to 3 seconds
    pagination: false, // ẩn nút next prev
    items: 4,
    itemsDesktop: [1199, 3],
    itemsDesktopSmall: [979, 3],
  });
});
$(document).ready(function () {
  $("#hot-product").owlCarousel({
    autoPlay: 5000, //Set AutoPlay to 3 seconds
    pagination: false, // ẩn nút next prev
    items: 3,
    itemsDesktop: [1199, 2],
    itemsDesktopSmall: [979, 2],
  });
});
$(document).ready(function () {
  $("#customer-carousel").owlCarousel({
    // autoPlay: 5000, //Set AutoPlay to 3 seconds
    pagination: false, // ẩn nút next prev
    items: 3,
    itemsDesktop: [1199, 2],
    itemsDesktopSmall: [979, 2],
  });
});
$(document).ready(function () {
  $("#news-carousel").owlCarousel({
    autoPlay: 9000, //Set AutoPlay to 3 seconds
    pagination: false, // ẩn nút next prev
    items: 4,
    itemsDesktop: [1199, 3],
    itemsDesktopSmall: [979, 2],
  });
});
$(document).ready(function () {
  $("#slide-img").owlCarousel({
    autoPlay: 5000, //Set AutoPlay to 3 seconds
    pagination: false, // ẩn nút next prev
    items: 4,
    // itemsDesktop: [1199, 3],
    // itemsDesktopSmall: [979, 3],
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 3,
        nav: false,
      },
      1000: {
        items: 4,
        nav: true,
        loop: false,
      },
    },
  });
});
$(document).ready(function () {
  $("#slide-img-footer").owlCarousel({
    autoPlay: 5000, //Set AutoPlay to 3 seconds
    pagination: false, // ẩn nút next prev
    items: 4,
    // itemsDesktop: [1199, 3],
    // itemsDesktopSmall: [979, 3],
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 3,
        nav: false,
      },
      1000: {
        items: 4,
        nav: true,
        loop: false,
      },
    },
  });
});
$(document).ready(function () {
  $("#blog-new").owlCarousel({
    autoPlay: 5000, //Set AutoPlay to 3 seconds
    pagination: false, // ẩn nút next prev
    items: 4,
    // itemsDesktop: [1199, 3],
    // itemsDesktopSmall: [979, 3],
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 2,
        nav: false,
      },
      1000: {
        items: 3,
        nav: true,
        loop: false,
      },
    },
  });
});
$(document).ready(function () {
  $("#blog-new-detail").owlCarousel({
    rtl: true,
    loop: true,
    margin: 10,
    nav: true,
    items: 4,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  });
});
