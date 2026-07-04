function initWillemLoadingAnimation() {
  const container = document.querySelector(".willem-header");
  const loadingLetter = container.querySelectorAll(".willem__letter");
  const box = container.querySelectorAll(".willem-loader__box");
  const growingImage = container.querySelectorAll(".willem__growing-image");
  const headingStart = container.querySelectorAll(".willem__h1-start");
  const headingEnd = container.querySelectorAll(".willem__h1-end");
  const coverImageExtra = container.querySelectorAll(".willem__cover-image-extra");
  const headerLetter = container.querySelectorAll(".willem__letter-white");
  const navLinks = container.querySelectorAll(".willen-nav .willem-nav__link, .osmo-credits__p");

  gsap.set(headerLetter, { yPercent: 110 });
  gsap.set(navLinks, { yPercent: 110 });

  const tl = gsap.timeline({
    defaults: {
      ease: "expo.inOut",
    },
    onStart: () => {
      container.classList.remove("is--hidden");
    }
  });

  if (loadingLetter.length) {
    tl.from(loadingLetter, {
      yPercent: 100,
      stagger: 0.025,
      duration: 1.25
    });
  }

  if (box.length) {
    tl.fromTo(box, {
      width: "0em",
    },{
      width: "1em",
      duration: 1.25
    }, "< 1.25");
  }

  if (growingImage.length) {
    tl.fromTo(growingImage, {
      width: "0%",
    },{
      width: "100%",
      duration: 1.25
    }, "<");
  }

  if (headingStart.length) {
    tl.fromTo(headingStart, {
      x: "0em",
    },{
      x: "-0.05em",
      duration: 1.25
    }, "<");
  }

  if (headingEnd.length) {
    tl.fromTo(headingEnd, {
      x: "0em",
    },{
      x: "0.05em",
      duration: 1.25
    }, "<");
  }

  if (coverImageExtra.length) {
    tl.fromTo(coverImageExtra, {
      opacity: 1,
    },{
      opacity: 0,
      duration: 0.05,
      ease: "none",
      stagger: 0.5
    }, "-=0.05");
  }

  if (growingImage.length) {
    tl.to(growingImage, {
      width: "100vw",
      height: "100dvh",
      duration: 2
    }, "< 1.25");
  }

  if (box.length) {
    tl.to(box, {
      width: "110vw",
      duration: 2
    }, "<");
  }

  if (headerLetter.length) {
    tl.to(headerLetter, {
      yPercent: 0,
      duration: 1.25,
      ease: "expo.out",
      stagger: 0.025
    }, "< 1.2");
  }

  if (navLinks.length) {
    tl.to(navLinks, {
      yPercent: 0,
      duration: 1.25,
      ease: "expo.out",
      stagger: 0.1
    }, "<");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initWillemLoadingAnimation();
});
