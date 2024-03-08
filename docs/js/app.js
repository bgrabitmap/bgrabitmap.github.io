import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js'
//import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js'
import { getQuotes } from './dataApi.js'
 
 const firebaseConfig = {
  apiKey: "AIzaSyCRMzakhggi4fRmL3aE8DFFIXMeu_lY_0Y",
  authDomain: "bgrabitmap.firebaseapp.com",
  projectId: "bgrabitmap",
  storageBucket: "bgrabitmap.appspot.com",
  messagingSenderId: "728161949558",
  appId: "1:728161949558:web:175524e00c53eab0e04c57",
  measurementId: "G-BQSSMRXTS8"
}; 
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics();  

// AGREGA CLASE boxCardAnimated AL HACER SCROLL PARA ANIMAR COMPONENTE CARD 
window.onscroll = function() {

    let scrollPosY = window.pageYOffset | document.body.scrollTop;

    if (scrollPosY >= 400) {
        const subir = document.querySelector('#subir');
        subir.classList.add("irArriba");
    } else {
        const subir = document.querySelector('#subir');
        subir.classList.remove("irArriba");
    }
};


// AGREGA CLASE current AL HACER SCROLL 
const mainNavLinks = document.querySelectorAll("nav div ul li a");
const mainNav = document.getElementById("navFixed");

window.addEventListener("scroll", event => {
    event.preventDefault();

    let fromTop = window.scrollY + mainNav.offsetHeight + (window.innerHeight - mainNav.offsetHeight) * 0.3;

    mainNavLinks.forEach(link => {
        let section = document.querySelector(link.hash);
        if (
            section.offsetTop <= fromTop &&
            section.offsetTop + section.offsetHeight > fromTop
        ) {
            link.classList.add("current");
        } else {
            link.classList.remove("current");
        }
    });
});


// DESPLAZAMIENTO SMOOTH SCROLL
window.onload = function() {

    fillSite();
    const easeInCubic = function(t) { return 0.5 - Math.cos(t * Math.PI)/2 }
    const scrollElems = document.getElementsByClassName('scroll');

    const scrollToElem = (start, stamp, duration, scrollEndElemTop, startScrollOffset) => {

        const runtime = stamp - start;
        let progress = runtime / duration;
        const ease = easeInCubic(progress);

        progress = Math.min(progress, 1);

        const newScrollOffset = startScrollOffset + (scrollEndElemTop * ease);
        window.scroll(0, startScrollOffset + (scrollEndElemTop * ease));

        if (runtime < duration) {
            requestAnimationFrame((timestamp) => {
                const stamp = new Date().getTime();
                scrollToElem(start, stamp, duration, scrollEndElemTop, startScrollOffset);
            })
        }
    }

    for (let i = 0; i < scrollElems.length; i++) {
        const elem = scrollElems[i];

        elem.addEventListener('click', function(e) {
            e.preventDefault();
            const scrollElemId = e.target.href.split('#')[1];
            const scrollEndElem = document.getElementById(scrollElemId);

            const anim = requestAnimationFrame(() => {
                const stamp = new Date().getTime();
                const duration = 800;
                const start = stamp;

                const startScrollOffset = window.pageYOffset;

                const scrollEndElemTop = scrollEndElem.getBoundingClientRect().top - mainNav.offsetHeight;

                scrollToElem(start, stamp, duration, scrollEndElemTop, startScrollOffset);
            })
        })
    }
}

async function fillSite() {
    await getQuotes()
        .then((quotes) => {
            let index = 0;
            let indicators = document.getElementById('testimonioIndicators');
            let texto = document.getElementById('testimonio');
            quotes.forEach((row) => {
              const quote = row.data();
              let string = '';
              let indicator = '';

              if (index == 0) {
                  string += `
                      <div class="carousel-item active">
                          <img class="d-block mx-auto" src="${quote.avatar}" alt=""> 
                  `;
                  indicator = `<li data-target="#carouselExampleIndicators" data-slide-to="${index}" class="active"></li>`;
              } else {
                  string += `
                      <div class="carousel-item">
                          <img class="d-block mx-auto" src="${quote.avatar}" alt="${quote.name}"> 
                  `;
                  indicator = `<li data-target="#carouselExampleIndicators" data-slide-to="${index}"></li>`;
              }

              string += ` <p class="text-center sliderText">${quote.quote}</p>`;
              string += `<p class="text-center"><b>${quote.name}</b></p>`;
              string += `</div>`;

              texto.innerHTML += string;
              indicators.innerHTML += indicator;
              index++;
            });
        }).catch((error) => {
            console.log('ERROR: ', error);
        });
}