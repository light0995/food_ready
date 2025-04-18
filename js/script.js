/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
const hamburger = document.querySelector(".hamburger");
const hamburger__toggle = document.querySelector(".hamburger__toggle");
const hamburger__inner = document.querySelector(".hamburger__inner");
const hamburger__line = document.querySelectorAll(".hamburger__line");
let hamburger_toggle_classList = hamburger__toggle.classList;
const previewListItem = document.querySelectorAll(".preview__list-item");
const previewMeals = document.querySelectorAll(".preview__meals");
const modal = document.querySelector(".modal");
const modalToggle = document.querySelectorAll("[data-modal]");
const modalClose = document.querySelector(".modal__close");
const deadline = "2025-03-26T09:36:00";
function hamburgerToggle() {
  hamburger__toggle.addEventListener("click", e => {
    e.preventDefault();
    if (hamburger_toggle_classList.contains("hamburger__toggle-active")) {
      hamburger__inner.classList.remove("hamburger__inner-active");
      hamburger__line.forEach(item => item.classList.remove("hamburger__line-active"));
      hamburger__toggle.classList.remove("hamburger__toggle-active");
    } else {
      hamburger__inner.classList.add("hamburger__inner-active");
      hamburger__line.forEach(item => item.classList.add("hamburger__line-active"));
      hamburger__toggle.classList.add("hamburger__toggle-active");
    }
  });
}
function switchPreviewMeals() {
  previewListItem.forEach((item, index) => {
    item.addEventListener("click", e => {
      e.preventDefault();
      previewListItem.forEach(item => item.classList.remove("preview__list-item-active"));
      previewListItem[index].classList.add("preview__list-item-active");
      previewMeals.forEach(item => item.classList.remove("preview__meals-active"));
      previewMeals[index].classList.add("preview__meals-active");
    });
  });
}
function getTimeRemaining(endtime) {
  const t = Date.parse(endtime) - Date.parse(new Date());
  let days, hours, minutes, seconds;
  if (t <= 0) {
    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
  } else {
    days = Math.floor(t / (1000 * 60 * 60 * 24)), hours = Math.floor(t / (1000 * 60 * 60) % 24), minutes = Math.floor(t / (1000 * 60) % 60), seconds = Math.floor(t / 1000 % 60);
  }
  return {
    total: t,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}
function getZero(num) {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
}
function setClock(selector, endtime) {
  const timer = document.querySelector(selector),
    days = timer.querySelector("#days"),
    hours = timer.querySelector("#hours"),
    minutes = timer.querySelector("#minutes"),
    seconds = timer.querySelector("#seconds");
  const timerId = setInterval(updateClock, 1000);
  updateClock();
  function updateClock() {
    const t = getTimeRemaining(endtime);
    days.innerHTML = `<span>${getZero(t.days)}</span> дней`;
    hours.innerHTML = `<span>${getZero(t.hours)}</span> часов`;
    minutes.innerHTML = `<span>${getZero(t.minutes)}</span> минут`;
    seconds.innerHTML = `<span>${getZero(t.seconds)}</span> секунд`;
    if (t.total <= 0) {
      clearInterval(timerId);
    }
  }
}
function openModal() {
  modal.classList.add("modal__active");
  modal.querySelector(".modal__inner").classList.add("modal__inner-active");
  clearInterval(modalTimerId);
}
function closeModal() {
  modal.classList.remove("modal__active");
}
document.addEventListener("keydown", e => {
  if (e.keyCode === 27) {
    closeModal();
  }
});
modal.addEventListener("click", e => {
  target = e.target.className;
  if (target === "modal__close" || target === "modal__overlay") {
    closeModal();
  }
});
modalToggle.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    openModal();
  });
});
function openModalByScroll() {
  if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
    openModal();
    window.removeEventListener("scroll", openModalByScroll);
  }
}
class Menu {
  constructor(src, alt, subtitle, descr, price, parentSelector, ...classes) {
    this.src = src;
    this.alt = alt;
    this.subtitle = subtitle;
    this.descr = descr;
    this.price = price;
    this.parentSelector = document.querySelector(parentSelector);
    this.classes = classes;
  }
  render() {
    const element = document.createElement("div");
    element.classList.add("menu__field-item");
    element.innerHTML = `
            <img src="${this.src}" alt="${this.alt}" class="menu__field-item-img">
            <div class="menu__field-item-subtitle" > ${this.subtitle} </div>
            <div class="menu__field-item-descr" > ${this.descr} </div>
            <div class="menu__field-item-divider"></div>
            <div class="menu__field-item-price" > 
                <div>Цена:</div>
                <div class="menu__field-item-total" > <span> ${this.price} </span> р/день  </div>
            </div>`;
    this.parentSelector.append(element);
  }
}


const forms = document.querySelectorAll("form");
const message = {
  loading: `icons/spinner.svg`,
  success: `<span style='color:green; font-size:24px' >\u2714</span> We will contact you soon`,
  fail: `<span style='color:red; font-size:24px'>\u2716</span> Something went wrong`
};


forms.forEach(item => bindPostData(item));


const postData = async (url, data) => {
  const res = await fetch(url, {
    method: "POST",
    body: data,
    headers: {
      'Content-type': 'application/json'
    }
  });
  return await res.json();
};


const getResource = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}. Status: ${res.status}`);
  };
  return await res.json();
}

getResource('http://localhost:3000/menu')
.then(data => {
  data.forEach(({img, altimg, title, descr, price}) => {
    new Menu(
      img, 
      altimg, 
      title, 
      descr, 
      price, '.menu__field')
      .render();
  })
});


function bindPostData(form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const statusMessage = document.createElement("img");
    statusMessage.style.cssText = `
      display: block;
      margin: 0 auto;`;
    statusMessage.classList.add("status");
    statusMessage.src = message.loading;
    form.insertAdjacentElement("afterend", statusMessage);
    const formData = new FormData(form);

    const json = JSON.stringify(Object.fromEntries(formData.entries()));

    postData('http://localhost:3000/requests', json)
    .then (data => { 
      console.log(data);
      showThanksModal(message.success)
    })
    .catch(() => {
      showThanksModal(message.fail)
    })
    .finally(() => {
      form.reset();
      statusMessage.remove();
    })



  });
  function showThanksModal(message) {
    const prevModalInner = document.querySelector(".modal__inner");
    prevModalInner.classList.remove("modal__inner-active");
    const thanksModal = document.createElement("div");
    thanksModal.innerHTML = `
    <h2 class="title modal__title">${message}</h2>
    `;
    thanksModal.classList.add("modal__inner", "modal__inner-active");
    document.querySelector(".modal__window").append(thanksModal);
    document.querySelector(".modal").classList.add("modal__active");
    setTimeout(() => {
      thanksModal.remove();
      prevModalInner.classList.toggle("modal__inner-active");
      closeModal();
    }, 4000);
  }
}
window.addEventListener("scroll", openModalByScroll);
const modalTimerId = setTimeout(openModal, 3000);
setClock(".promotion__timer", deadline);
switchPreviewMeals();
hamburgerToggle();



function mySlider () {

  const sliderImgParent = document.querySelector('.offer__sliders');
  const sliderImgs = document.querySelectorAll('.offer__slider-img');
  const sliderPrevBtn = document.querySelector('.offer__slider-prev');
  const sliderNextBtn = document.querySelector('.offer__slider-next');
  const currentSliderNum = document.querySelector('.current__slider-num');
  
  
  function findActiveSlider (sliders) {
    let currentActiveIndex = 0;
    sliders.forEach((slider, index) => {
      if (slider.classList.contains('offer__slider-img-active')) {
       currentActiveIndex = index;
      }
    });
    return currentActiveIndex;
  };
  
  function nextSlider (sliders) {
    let currentActiveIndex = findActiveSlider(sliders);
    sliders.forEach(slider => slider.classList.remove('offer__slider-img-active'));
    if (currentActiveIndex === sliders.length - 1) {
      currentActiveIndex = 0;
      currentSliderNum.innerHTML = 0;

    };
    sliders[currentActiveIndex + 1].classList.add('offer__slider-img-active');
    currentSliderNum.innerHTML = `0${currentActiveIndex + 1}`;
  };
  
  function prevSlider (sliders) {
    let currentActiveIndex = findActiveSlider(sliders);
    sliders.forEach(slider => slider.classList.remove('offer__slider-img-active'));
  
    if (currentActiveIndex > 0) {
      sliders[currentActiveIndex - 1].classList.add('offer__slider-img-active');

    }
    if (currentActiveIndex === 0) {
      sliders[sliders.length -1].classList.add('offer__slider-img-active')
    }

  };
  sliderNextBtn.addEventListener('click', () => {
    nextSlider(sliderImgs);
  });
  sliderPrevBtn.addEventListener('click', () => {
    prevSlider(sliderImgs);
  })
  
};



const slides = document.querySelectorAll('.offer__sliders'),
prev = document.querySelector('.offer__slider-prev'),
next = document.querySelector('.offer__slider-next');

let slideIndex = 1;


showSlides(slideIndex);

function showSlides(n) {
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    slides.forEach((item) => item.style.display = 'none');

    slides[slideIndex - 1].style.display = 'block';

}

function plusSlides (n) {
    showSlides(slideIndex += n);
}

prev.addEventListener('click', function(){
    plusSlides(-1);
});

next.addEventListener('click', function(){
    plusSlides(1);

  });


/******/ })()
;
//# sourceMappingURL=script.js.map