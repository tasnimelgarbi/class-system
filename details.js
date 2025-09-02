const API_URL = "https://script.google.com/macros/s/AKfycbyWfwvqLfrFPe2E8_rHsPfbKgiUNBv05kwWpXpek1DMsiPeLnPF4V1fOFVtkso5n7QOiw/exec"; // حطي رابطك هنا

const searchInput = document.getElementById("searchInput");
const studentsTable = document.getElementById("studentsTable");
const tbody = studentsTable.querySelector("tbody");
const cards = document.getElementById("studentsCards");

let debounceTimer = null;

// helper: read flexible field names
function field(obj, ...keys) {
  for (const k of keys) {
    if (obj && (obj[k] !== undefined) && obj[k] !== null) return obj[k];
  }
  return "";
}

function escapeHtml(text) {
  if (text === undefined || text === null) return "";
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  doSearch(""); // جلب الكل
  searchInput.addEventListener("input", onSearchInput);
});

function onSearchInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const q = searchInput.value.trim();
    doSearch(q);
  }, 300);
}

async function doSearch(q) {
  try {
    const url = q ? `${API_URL}?search=${encodeURIComponent(q)}` : API_URL;
    const res = await fetch(url);
    const data = await res.json(); // مفترض array
    renderResults(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Fetch error:", err);
    alert("حصل مشكلة في جلب الداتا من الشيت. اتأكدي إنك منشّرة الـ Web App وصلاحياته صح.");
  }
}

function renderResults(rows) {
  tbody.innerHTML = "";
  cards.innerHTML = "";

  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td class="py-3 px-6" colspan="3">مفيش بيانات</td></tr>`;
    return;
  }

  rows.forEach(r => {
    const id = field(r, "id", "رقم", "rowNumber") || "";
    const name = field(r, "الاسم", "name") || "";
    const year = field(r, "الصف الدراسي", "year") || "";

    const tr = document.createElement("tr");
    tr.className = "hover:bg-cyan-50 border-b border-cyan-200";
    tr.innerHTML = `
      <td class="py-3 px-6">${escapeHtml(name)}</td>
      <td class="py-3 px-6">${escapeHtml(year)}</td>
      <td class="py-3 px-6 flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
        <button data-id="${id}" class="editBtn bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition justify-center" title="تعديل">
          <i class="fa-solid fa-pen-to-square"></i> تعديل
        </button>
      </td>
    `;
    tbody.appendChild(tr);

    const card = document.createElement("div");
    card.className = "p-4";
    card.innerHTML = `
      <p class="font-bold text-cyan-700">${escapeHtml(name)}</p>
      <p class="text-gray-600 text-sm mb-3">${escapeHtml(year)}</p>
      <div class="flex flex-col gap-2">
        <button data-id="${id}" class="editBtn mobile bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 justify-center">
          <i class="fa-solid fa-pen-to-square"></i> تعديل
        </button>
      </div>
    `;
    cards.appendChild(card);
  });

  document.querySelectorAll(".editBtn").forEach(btn => btn.addEventListener("click", onEdit));
}

function onEdit(e) {
  const id = e.currentTarget.getAttribute("data-id");
  if (!id) return alert("مفيش id للتعديل");
  window.location.href = `log.html?edit=${id}`;
}
