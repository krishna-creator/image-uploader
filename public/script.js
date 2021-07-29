var card = document.getElementById("card");
var filetypes = ["image/png", "image/jpg", "image/jpeg"];
var dragarea = document.getElementById("dragarea");
dragarea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dragarea.style.opacity = 1;
  dragarea.style.backgroundColor = "#dae1eb";
});
dragarea.addEventListener("dragleave", () => {
  dragarea.style.opacity = 0.6;
  dragarea.style.backgroundColor = "#f6f8fb";
});
dragarea.addEventListener("drop", (e) => {
  e.preventDefault();
  var image = e.dataTransfer.files[0];
  var imagetype = image.type;
  if (filetypes.includes(imagetype)) {
    var newelement = document.createElement("div");
    newelement.className = "progress";
    newelement.innerHTML = "Uploading...";
    card.innerHTML = newelement;
    upload(image);
  } else {
    alert("Wrong format Please try again with correct format");
    dragarea.style.opacity = 0.6;
    dragarea.style.backgroundColor = "#f6f8fb";
  }
});
upload = (imagefile) => {
  let url = "http://localhost:3000/";
  let formdata = new FormData();
  formdata.append("img", imagefile);

  fetch(url, {
    method: "POST",
    body: formdata,
  })
    .then((result) => {
      result.json().then((result) => {
        console.log(result);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
var container = document.getElementById("container");
fetch("http://localhost:3000/images")
  .then((result) => {
    result.json().then((result) => {
      container.innerHTML = result
        .map((obj) => {
          return `<img width='150px' height='150px' src='uploads/${obj.img}' alt="image not found">`;
        })
        .join("");
    });
  })
  .catch((err) => {
    console.log(err);
  });
