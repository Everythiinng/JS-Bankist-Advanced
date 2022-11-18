'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

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
