document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm"),
    msg = document.getElementById("formMessage");
  if (form)
    form.onsubmit = (e) => {
      e.preventDefault();
      msg.textContent =
        "Thanks! Your message has been received as a FreshFind demo.";
      form.reset();
    };
  const btn = document.getElementById("findLocation"),
    status = document.getElementById("locationStatus"),
    map = document.getElementById("contactMap");
  if (btn)
    btn.onclick = () => {
      if (!navigator.geolocation) {
        status.textContent = "Geolocation is not supported by this browser.";
        return;
      }
      status.textContent = "Finding your location…";
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const { latitude, longitude } = p.coords;
          status.textContent = `Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}.`;
          map.src = `https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;
        },
        (e) => {
          status.textContent =
            e.code === 1
              ? "Location permission was denied."
              : e.code === 2
                ? "Your location could not be determined."
                : "The location request timed out.";
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    };
});
