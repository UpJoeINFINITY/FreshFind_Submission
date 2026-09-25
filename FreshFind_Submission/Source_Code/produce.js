document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("produceGrid"),
    empty = document.getElementById("emptyState"),
    search = document.getElementById("produceSearch");
  const produce = await fetch("produce.json").then((r) => r.json());
  let selected = new URLSearchParams(location.search).get("category") || "All";
  const pills = [...document.querySelectorAll(".filter-pill")];
  function setActive() {
    pills.forEach((p) =>
      p.classList.toggle("active", p.dataset.category === selected),
    );
  }
  function render() {
    const q = search.value.toLowerCase().trim();
    const f = produce.filter(
      (x) =>
        (selected === "All" || x.category === selected) &&
        (!q ||
          `${x.name} ${x.category} ${x.description}`.toLowerCase().includes(q)),
    );
    grid.innerHTML = f
      .map(
        (x) =>
          `<article class="produce-card"><div class="card-image" style="background-image:url('${x.image}')"><span class="badge">${x.category}</span></div><div class="card-content"><h3>${x.name}</h3><p>${x.description}</p><div class="meta"><i class="fa-regular fa-calendar"></i> Season: ${x.season}</div><div class="meta"><i class="fa-solid fa-store"></i> Markets: ${x.markets}</div><a class="view-markets" href="market-directory.html?produce=${encodeURIComponent(x.category)}">View Markets <i class="fa-solid fa-arrow-right"></i></a></div></article>`,
      )
      .join("");
    empty.classList.toggle("hidden", !f.length);
  }
  pills.forEach(
    (p) =>
      (p.onclick = () => {
        selected = p.dataset.category;
        search.value = "";
        setActive();
        render();
      }),
  );
  search.oninput = render;
  document.getElementById("viewAll").onclick = () => {
    selected = "All";
    search.value = "";
    setActive();
    render();
  };
  setActive();
  render();
});
