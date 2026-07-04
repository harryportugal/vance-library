const INTRO_IMAGES_COUNT = 6;
const INTRO_END_DELAY_SEC = 0.35 + (INTRO_IMAGES_COUNT - 1) * 0.25 + 1 + 1;

function splitWords(element) {
  const raw = element.textContent.trim();
  element.textContent = "";
  const words = raw.split(/\s+/);
  const nodes = [];

  words.forEach((word, index) => {
    const mask = document.createElement("span");
    mask.className = "word-mask";

    const inner = document.createElement("span");
    inner.className = "word";
    inner.textContent = word;

    mask.appendChild(inner);
    element.appendChild(mask);
    nodes.push(inner);

    if (index < words.length - 1) {
      const space = document.createElement("span");
      space.className = "word-space";
      element.appendChild(space);
    }
  });

  return nodes;
}

document.addEventListener("DOMContentLoaded", () => {
  const images = gsap.utils.toArray(".intro-image");
  const frame = document.getElementById("js-frame");
  const radial = document.getElementById("js-radial");
  const logo = document.getElementById("js-logo");
  const hero = document.getElementById("js-hero");

  const logoWords = splitWords(logo);
  const heroWords = splitWords(hero);

  gsap.set(logo, { opacity: 1 });
  gsap.set(hero, { opacity: 1 });
  gsap.set(logoWords, { yPercent: 110, opacity: 0 });
  gsap.set(heroWords, { yPercent: 110, opacity: 0 });
  gsap.set(images, { clipPath: "inset(0% 0% 100% 0%)" });

  const introTl = gsap.timeline();

  introTl.to(images, {
    clipPath: "inset(0% 0% 0% 0%)",
    duration: 1,
    delay: 0.35,
    stagger: { each: 0.25, ease: "power1.out" }
  });

  introTl.to(frame, {
    width: "100%",
    height: "100dvh",
    maxWidth: "none",
    aspectRatio: "unset",
    margin: 0,
    duration: 1,
    ease: "power3.inOut"
  });

  introTl.to(
    radial,
    {
      opacity: 1,
      duration: 0.85,
      ease: "power2.out"
    },
    ">"
  );

  gsap.to(logoWords, {
    yPercent: 0,
    opacity: 1,
    duration: 0.75,
    ease: "power3.out",
    stagger: 0.05,
    delay: 0.6
  });

  gsap.to(heroWords, {
    yPercent: 0,
    opacity: 1,
    duration: 0.95,
    ease: "power3.out",
    stagger: 0.075,
    delay: INTRO_END_DELAY_SEC
  });
});
