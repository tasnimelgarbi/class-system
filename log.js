const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const spinner = document.getElementById("loadingSpinner");
const scriptURL = "https://script.google.com/macros/s/AKfycbyWfwvqLfrFPe2E8_rHsPfbKgiUNBv05kwWpXpek1DMsiPeLnPF4V1fOFVtkso5n7QOiw/exec";
const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("edit"); 

if (editId) {
  fetch(scriptURL + "?search=") 
    .then(res => res.json())
    .then(data => {
      const student = data.find(s => s.id == editId);
      if (!student) return alert("مفيش بيانات للطالب ده");

      document.getElementById("name").value = student["الاسم"];
      document.getElementById("year").value = student["الصف الدراسي"];
      document.getElementById("phone").value = student["رقم الهاتف"] || "";

      const months = [];
      ["سبتمبر","أكتوبر","نوفمبر","ديسمبر","يناير","فبراير","مارس","أبريل","مايو"].forEach(m => {
        if (student[m] === "✅") months.push(m);
      });
      document.querySelectorAll('input[name="pay-month"]').forEach(cb => {
        cb.checked = months.includes(cb.value);
      });

      btnText.textContent = "تحديث الطالب";
    })
    .catch(err => {
      console.error(err);
      alert("حصل خطأ في جلب بيانات الطالب");
    });
}

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

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const studentName = document.getElementById("name").value.trim();
    const year = document.getElementById("year").value;
    const phone = document.getElementById("phone").value.trim();
    const months = Array.from(document.querySelectorAll('input[name="pay-month"]:checked')).map(c => c.value);

    if (studentName === "" || year === "") {
        alert("❌ لازم تملى كل البيانات");
        return;
    }

    btnText.textContent = editId ? "جارٍ التحديث..." : "جارٍ الإرسال...";
    spinner.classList.remove("hidden");
    submitBtn.disabled = true;

    const payload = {
      name: studentName,
      year: year,
      phone: phone,
      months: months
    };

    if (editId) {
      payload.action = "update";
      payload.id = parseInt(editId); 
    }

    fetch(scriptURL, {
        method: "POST",
        mode: "no-cors", 
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(() => {
        alert(editId ? "✅ تم تعديل الطالب بنجاح" : "✅ تم تسجيل الطالب بنجاح");
        form.reset();
        if (editId) window.location.href = "details.html"; 
    })
    .catch(err => {
        console.error(err);
        alert("❌ حصل خطأ أثناء التسجيل: " + err);
    })
    .finally(() => {
        btnText.textContent = editId ? "تحديث الطالب" : "تسجيل الطالب";
        spinner.classList.add("hidden");
        submitBtn.disabled = false;
    });
});
