"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const h1 = document.querySelector('h1');
const header = document.querySelector(".header");
const sections = document.querySelectorAll(".section");
// const featuresImages = document.querySelectorAll('.features__img');
const featuresImages = document.querySelectorAll("img[data-src");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");
const dotsContainer = document.querySelector(".dots");
const allDots = document.querySelectorAll(".dots__dot");




// IMPLEMENING SMOOTH SCROLLING
btnScrollTo.addEventListener('click', function (e) {

  // NEW WAY OF IMPLEMETNING SCROLL
  section1.scrollIntoView({ behavior: "smooth" });
});


// EVENT DELEGTAION

// ADDING EVENTS THIS WAY CREATES COPIES OF THE SAME FUNCTION - NOT GOOD FOR PERFORMANCE
// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = el.getAttribute("href");
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" })
//   })
// });

// DELEGATE THE EVENT BY ADDING IT TO A COMMON PARENT 
document.querySelector(".nav__links").addEventListener('click', function (e) {
  e.preventDefault();

  // MATCHING STRATEGY = TO IGNORE CLICKS FROM POINTS WE DO NOT WANT 
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});


// TABBED COMPONENTS
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest(".operations__tab");
  
  // GUARDS CLAUSE
  // TO RETURN IF ANY PART OF THE TABS CONTAINER EXCEPT THE BUTTONS IS CLICKED
  if (!clicked) return;
  // console.log(clicked);

  // TO REMOVE THE ACTIVE TAB CLASS FROM ALL BUTTONS
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));

  // TO ADD THE ACTIVE TAB CLASS TO THE CLICKED BUTTON
  clicked.classList.add("operations__tab--active");

  // TO REMOVE THE ACTIVE TAB CLASS FROM ALL TAB CONTENT
  tabsContent.forEach((content) => {
    content.classList.remove("operations__content--active");
  });

  // GETTING THE TAB NUMBER FROM THE DATA ATTRIBUTE OF THE CLICKED BIUTTON
  const tabNum = clicked.dataset.tab;

  // TO ACTIVATE THE CLICKED TAB CONTENT
  const contentDisplayed = document.querySelector(
    `.operations__content--${tabNum}`
  );
  contentDisplayed.classList.add("operations__content--active");
})


// HOVERING AND FADING
// The 'mouseenter' and 'mouseover' events are similar. The big difference is the 'mouseenter' event does not bubble.
// The opposites of 'mouseenter' is 'mouseleave'. The opposite of 'mouseover' is "mouseout"

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((s) => {
      if (s !== link) s.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

// USING BIND TO PASS AN ARGUMENT INTO THE FXN WITHOUT CALLING IT.
// THE VALUES ARE PASSED AS THE THIS KWEYWORD AND THE THIS KEYWORD IS PASSED INTO THE FXN ABOVE AS A VALUE
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));



// STICKY NAV- MAKE THE NAV STICKY AFTER SCROLLING TO A CERTAIN POINT ON THE PAGE

// USING WINDOW SCROLL EVENT - NOT RELIABLE OR GOOD FOR PERFORMANCE
// window.addEventListener('scroll', function () {
//   const initialcoords = section1.getBoundingClientRect();

//   if (window.scrollY > initialcoords.top) nav.classList.add('sticky');
//   else nav.classList.remove("sticky");
// });


// USING THE INTERSECTION OBSERVER API
// const obsCallBack = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry)
//   })
// }

// const obsOptions = {
//   root: null,
//   threshold: 0
// }

// const observer = new IntersectionObserver(obsCallBack, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");

}

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
}

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);



// REVEALING SECTIONS WHEN THEY ARE SCROLLED INTO

const sectionReveal = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return; //GUARD CLAUSE
  
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
}

const obsOpts = {
  root: null,
  threshold : 0.15
}

const sectionsObserver = new IntersectionObserver(sectionReveal, obsOpts);
sections.forEach(function (section) {
  sectionsObserver.observe(section)
  // ADDING THE HIDDEN CLASS WITH JS SO BROWSERS THAT HAVE DISABLED JS CAN SEE THE SECTIONS
  section.classList.add("section--hidden");
})


// LAZY LOADING IMAGES
const imageLoader = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);

}

const imageObsOptions = {
  root: null,
  threshold: 0,
  rootMargin : "200px"
}

const imageObserver = new IntersectionObserver(imageLoader, imageObsOptions);
featuresImages.forEach(image => imageObserver.observe(image));


// SLIDER
// MAKE THE ENTIRE SLIDER INTO A FUNCTION

const slider = function ()  {
  let curSlide = 0;
  const maxSlides = slides.length;

  // FUNCTIONS

  const goToSlide = function (slide) {
    slides.forEach(function (s, i) {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  // MOVE TO NEXT SLIDE ON THE RIGHT
  const nextSlide = function () {
    if (curSlide === maxSlides - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // MOVE TO PREVIOUS SLIDE ON THE LEFT
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlides - 1;
    else curSlide--;

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // CREATE THE SLIDER DOT BUTTONS
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class='dots__dot' data-slide=${i}></button>`
      );
    });
  };

  // INDICATE THE ACTIVE DOT
  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const initSlider = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  initSlider();

  // EVENT LISTENERS
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  // USING THE KEYBOARD TO NAV THE SLIDER
  // document.addEventListener("keydown", function (e) {
  //   if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" ) return;
  //   if (e.key === "ArrowLeft") prevSlide();
  //   if (e.key === "ArrowRight") nextSlide();
  // })

  // USING THE KEYBOARD TO NAV THE SLIDER
  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.key === "ArrowLeft" && prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  // USING THE DOTS TO NAV THE SLIDER
  dotsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
}

slider();







// 
// 
// 
// 
// AN EVENT FIRED AFTER THE HTML AND JS HAVE BEEN LOADED WITHOUT EXTERNAL RESOURCES SUCH AS IMAGES
document.addEventListener('DOMContentLoaded', console.log('loaded!!!'))


// FIRED AFTER THE HTML AND JS AND ALL EXTERNAL RESOURCES SUCH AS IMAGES AND CSS FILES HAVE BEEN LOADED
window.addEventListener('load', console.log('PAGE FULLY LOADED'));

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   e.returnValue = '';
//   console.log('Before unload')

// })