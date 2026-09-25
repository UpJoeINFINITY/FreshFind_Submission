document.addEventListener("DOMContentLoaded", async () => {
  const id = new URLSearchParams(location.search).get("id") || "ikot";
  const markets = await fetch("markets.json").then((r) => r.json());
  const m = markets.find((x) => x.id === id) || markets[0];
  document.title = `FreshFind | ${m.name}`;
  document.getElementById("crumbName").textContent = m.name;
  document.getElementById("detailName").textContent = m.name;
  document.getElementById("detailArea").textContent = m.area;
  document.getElementById("detailDescription").textContent = m.description;
  document.getElementById("detailAddress").textContent = m.address;
  document.getElementById("detailDays").textContent = m.days.join(" · ");
  document.getElementById("detailHours").textContent = m.hours;
  document.getElementById("mapAddress").textContent = m.address;
  document.getElementById("detailImage").style.backgroundImage =
    `url('${m.image}')`;
  document.getElementById("mapsLink").href =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.address)}`;
  document.getElementById("detailMap").src =
    `https://www.google.com/maps?q=${encodeURIComponent(m.address)}&output=embed`;
  document.getElementById("detailProduce").innerHTML = m.produce
    .map(
      (p, i) =>
        `<article class="produce-tag"><i class="fa-solid ${["fa-carrot", "fa-apple-whole", "fa-leaf", "fa-fish"][i % 4]}"></i><h3>${p}</h3><p>Fresh ${p.toLowerCase()} from market vendors. Check the Produce Guide for seasonal picks.</p></article>`,
    )
    .join("");
});
