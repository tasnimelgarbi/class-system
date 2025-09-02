const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("closeBtn");

menuBtn.addEventListener("click", () => {
  sidebar.classList.remove("-translate-x-full");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.add("-translate-x-full");
});

document.addEventListener("DOMContentLoaded", function () {
  const title = document.getElementById("title");
  const text = title.getAttribute("data-text");
  let i = 0;

  title.classList.add("cursor");

  function typeEffect() {
    if (i < text.length) {
      title.textContent += text.charAt(i);
      i++;
      setTimeout(typeEffect, 150);
    } else {
      title.classList.remove("cursor");
    }
  }

  typeEffect();
});