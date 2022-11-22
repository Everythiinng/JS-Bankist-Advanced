'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault(); // We use preventDefault cuz we have the href=#, we use this so the website doesnt jump to start after clicking
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

//////////////////////////////////////////
// Closing Modal functionality
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////
// BTN scroll/jump to functionality
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', e => {
  // Old way
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // New way
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////
// Page navigation

// This is not good practice because we are attaching eventListeners to all the links, not good with 1000 links <--IMPORTANT-->
/*
document.querySelectorAll('.nav__link').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const id = this.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

// Good practice is using EVENT DELEGATION
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target); // <A></A>, so the event is added to the parent of NAVLINKS, and each time a link is clicked it will be passed
  // down from the parent and with e.target we get WHICH link was pressed.

  //// Matching Strategy (tricky part)
  // We need to add an if incase we click the UL parent to not run an error function
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();

    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////////////////////
// Tabbed Component - Event delegation

tabsContainer.addEventListener('click', function (e) {
  // Matching Strategy
  // const clicked = e.target; // this will get the button, but if in case we click at the number of the button which is a <span></span>
  // it will get that span

  // Best practice
  const clicked = e.target.closest('.operations__tab');

  // Guard clause( this function is helpful if it returns NULL) <--IMPORTANT-->
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active')); // removing active class for the other buttons
  tabsContent.forEach(t => t.classList.remove('operations__content--active')); // removing active class for the other contents

  // Activate tab (btns)
  clicked.classList.add('operations__tab--active'); // We will get an error if we dont specify the guard clause in case we click the buttons container

  // Activate content area
  console.log(clicked.dataset.tab); // output: 2 (We have data-tab:2 in the operations__tab in index.html)
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5)); // mouseover = bubbles, mouseenter = doesnt bubble

nav.addEventListener('mouseout', handleHover.bind(1)); // mouseout = mouse leaves the element

/////////////////////////////////////////
// Sticky navigation - Intersection Observer API
// Most efficient way

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // We give this a -90 margin to the header so we can align the nav with the line where the header ends
  // This is just a visual margin not a real one. The nav is 90px so we give this -90px to the rootMargin so the isIntersecting becomes
  // false not when it reaches 0 but + 90px
});
headerObserver.observe(header);

//////////////////////////////////////////
// Reveal sections

const allSection = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  else entry.target.classList.remove('section--hidden');
  observer.unobserver(entry.target); // We remove each section from the observer incase we scroll back we wont have the API keep track
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//////////////////////////////////////////
// Lazy Loading images

const imgTargets = document.querySelectorAll('img[data-src]'); // This selects images with attribute [data-src].

const loadimg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  }); // we remove the lazy-img class with an evenlistener and not directly.

  observer.unobserver(entry.target);
};

const imgObserver = new IntersectionObserver(loadimg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////////
// Slider component

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlide = slides.length;

// slides.forEach((s, i) => {
//   s.style.transform = `translateX(${100 * i}%)`;
// });

const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};
goToSlide(0);

// Next slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
};

// Prev Slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);
