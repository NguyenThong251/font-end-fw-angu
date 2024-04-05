// var modalOverlay = document.getElementById("overlay-cart");
// var closeCart = document.getElementById("close-cart");
// var modalViewCart = document.getElementById("modal-cart-view");
// var cartClick = document.getElementById("cart-click");
// function getModalViewCart() {
//   modalOverlay.classList.remove("d-none");
//   modalOverlay.classList.add("overlay-ani");
//   modalViewCart.classList.remove("modal-cart-view");
//   modalViewCart.classList.add("fadeInRight");
//   modalViewCart.classList.add("modal-cart-view-active");
//   modalOverlay.addEventListener("click", () => {
//     modalOverlay.classList.add("d-none");
//     modalOverlay.classList.add("overlay-ani");
//     modalViewCart.classList.remove("modal-cart-view-active");
//     modalViewCart.classList.add("modal-cart-view");
//   });
//   closeCart.addEventListener("click", () => {
//     modalOverlay.classList.add("d-none");
//     modalOverlay.classList.add("overlay-ani");
//     modalViewCart.classList.remove("modal-cart-view-active");
//     modalViewCart.classList.add("modal-cart-view");
//   });
// }
// cartClick.addEventListener("click", getModalViewCart);

// // validate bootstrap 5
// (() => {
//   "use strict";

//   // Fetch all the forms we want to apply custom Bootstrap validation styles to
//   const forms = document.querySelectorAll(".needs-validation");

//   // Loop over them and prevent submission
//   Array.from(forms).forEach((form) => {
//     form.addEventListener(
//       "submit",
//       (event) => {
//         if (!form.checkValidity()) {
//           event.preventDefault();
//           event.stopPropagation();
//         }

//         form.classList.add("was-validated");
//       },
//       false
//     );
//   });
// })();

// //Gsap
// function gsapButton() {
//   document.querySelectorAll(".truck-button").forEach((button) => {
//     // e.preventDefault();
//     let box = button.querySelector(".box"),
//       truck = button.querySelector(".truck");
//     if (!button.classList.contains("done")) {
//       if (!button.classList.contains("animation")) {
//         button.classList.add("animation");
//         gsap.to(button, {
//           "--box-s": 1,
//           "--box-o": 1,
//           duration: 0.3,
//           delay: 0.5,
//         });
//         gsap.to(box, {
//           x: 0,
//           duration: 0.4,
//           delay: 0.7,
//         });
//         gsap.to(button, {
//           "--hx": -5,
//           "--bx": 50,
//           duration: 0.18,
//           delay: 0.92,
//         });
//         gsap.to(box, {
//           y: 0,
//           duration: 0.1,
//           delay: 1.15,
//         });
//         gsap.set(button, {
//           "--truck-y": 0,
//           "--truck-y-n": -26,
//         });
//         gsap.to(button, {
//           "--truck-y": 1,
//           "--truck-y-n": -25,
//           duration: 0.2,
//           delay: 1.25,
//           onComplete() {
//             gsap
//               .timeline({
//                 onComplete() {
//                   button.classList.add("done");
//                 },
//               })
//               .to(truck, {
//                 x: 0,
//                 duration: 0.4,
//               })
//               .to(truck, {
//                 x: 40,
//                 duration: 1,
//               })
//               .to(truck, {
//                 x: 20,
//                 duration: 0.6,
//               })
//               .to(truck, {
//                 x: 96,
//                 duration: 0.4,
//               });
//             gsap.to(button, {
//               "--progress": 1,
//               duration: 2.4,
//               ease: "power2.in",
//             });
//           },
//         });
//       }
//     } else {
//       button.classList.remove("animation", "done");
//       gsap.set(truck, {
//         x: 4,
//       });
//       gsap.set(button, {
//         "--progress": 0,
//         "--hx": 0,
//         "--bx": 0,
//         "--box-s": 0.5,
//         "--box-o": 0,
//         "--truck-y": 0,
//         "--truck-y-n": -26,
//       });
//       gsap.set(box, {
//         x: -24,
//         y: -6,
//       });
//     }
//   });
// }
