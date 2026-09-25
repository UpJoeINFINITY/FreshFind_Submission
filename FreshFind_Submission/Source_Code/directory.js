document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("directoryGrid"),
    count = document.getElementById("resultCount"),
    search = document.getElementById("marketSearch"),
    area = document.getElementById("areaFilter"),
    day = document.getElementById("dayFilter"),
    produce = document.getElementById("produceFilter");
  let markets = [];
  async function load() {
    markets = await fetch("markets.json").then((r) => r.json());
    render();
  }
  function render() {
    const q = search.value.toLowerCase().trim();
    const f = markets.filter(
      (m) =>
        (!q ||
          `${m.name} ${m.area} ${m.description}`.toLowerCase().includes(q)) &&
        (!area.value || m.area === area.value) &&
        (!day.value || m.days.includes(day.value)) &&
        (!produce.value || m.produce.includes(produce.value)),
    );
    count.textContent = `${f.length} market${f.length === 1 ? "" : "s"} found`;
    grid.innerHTML =
      f
        .map(
          (m) =>
            `<article class="card directory-card"><div class="market-image"><img src="${m.image}" alt="${m.name}"><span class="open-badge">Open this week</span><button class="save-btn" onclick="alert('Saved markets are a demo feature.')"><i class="fa-regular fa-heart"></i></button></div><div class="directory-card-body"><span class="location"><i class="fa-solid fa-location-dot"></i> ${m.area}</span><h3>${m.name}</h3><p>${m.description}</p><div class="market-meta"><span><i class="fa-regular fa-calendar"></i> ${m.days.join(" · ")}</span><span><i class="fa-regular fa-clock"></i> ${m.hours}</span></div><a class="view-link" href="market-detail.html?id=${m.id}">View Details <i class="fa-solid fa-arrow-right"></i></a></div></article>`,
        )
        .join("") || "<p>No markets match those filters.</p>";
  }
  document.getElementById("filterSubmit").onclick = render;
  [search, area, day, produce].forEach((x) =>
    x.addEventListener("input", render),
  );
  load();
});
