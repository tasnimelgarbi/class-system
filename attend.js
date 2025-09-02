const form = document.getElementById("attendanceForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const spinner = document.getElementById("loadingSpinner");
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

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const studentName = document.getElementById("studentName").value.trim();
  const date = document.getElementById("date").value;
  const status = document.getElementById("status").value;
  const year = document.getElementById("year").value; 


  if (studentName === "" || date === "" || status === "" || year === "") {
    alert("❌ لازم تملى كل البيانات");
    return;
  }

  btnText.textContent = "جارٍ الإرسال...";
  spinner.classList.remove("hidden");
  submitBtn.disabled = true;

  fetch("https://script.google.com/macros/s/AKfycbwk-VDgFfM7kbEllNvTxFwbPG533KVUN_EfyH-iQflc-1-BUuA8zTBrUssPWuWaAd3tGA/exec", {
    method: "POST",
    mode: "no-cors",
    body: JSON.stringify({
      name: studentName,
      date: date,
      status: status,
      year: year
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.text())
    .then(data => {
      alert("✅ تم تسجيل بنجاح");
      form.reset();
    })
    .catch(err => alert("حصل خطأ ❌: " + err))
    .finally(() => {
      // إيقاف اللودينج
      btnText.textContent = "تسجيل الحضور";
      spinner.classList.add("hidden");
      submitBtn.disabled = false;
    });
});