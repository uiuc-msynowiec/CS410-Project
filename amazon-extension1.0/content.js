//testing small change to logo
const logo = document.getElementById("nav-logo-sprites");
if (logo) {
  logo.style.filter = "hue-rotate(120deg)";//shift color
}

//add a simple message banner at the top of the page so I know it works
const banner = document.createElement("div");
banner.textContent = "✅ Amazon Test Extension Active";
banner.style.background = "#FFD700";
banner.style.color = "#000";
banner.style.textAlign = "center";
banner.style.padding = "10px";
banner.style.fontWeight = "bold";
document.body.prepend(banner);
