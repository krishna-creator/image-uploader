var src;
var card = document.getElementById("card");
var filetypes = ["image/png", "image/jpg", "image/jpeg"]; //acceptable file types
var dragarea = document.getElementById("dragarea"); //drag part
var label = document.getElementById("label");
var formdata = document.getElementById("img");
formdata.onchange = () => {
  let image = formdata.files[0];
  let imagetype = image.type;
  checkingtype(image, imagetype);
};
//darg over highlight the box
dragarea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dragarea.style.opacity = 1;
  dragarea.style.backgroundColor = "#dae1eb";
});
//drag leave comes to original
dragarea.addEventListener("dragleave", () => {
  dragarea.style.opacity = 0.6;
  dragarea.style.backgroundColor = "#f6f8fb";
});
//image droped
dragarea.addEventListener("drop", (e) => {
  e.preventDefault(); //preventing to open the image in new tab
  let image = e.dataTransfer.files[0]; //transger only one image
  let imagetype = image.type;
  checkingtype(image, imagetype);
});
checkingtype = (image, imagetype) => {
  if (filetypes.includes(imagetype)) {
    //checks for valid filetype
    card.innerHTML = `Uploading...<div class='progress'></div>`; //add loading element
    card.style.textAlign = "left";
    upload(image);
  } else {
    //if not vlaid filetype alert msg
    alert("Wrong format Please try again with correct format");
    dragarea.style.opacity = 0.6;
    dragarea.style.backgroundColor = "#f6f8fb";
  }
};
upload = (imagefile) => {
  let url = "http://localhost:3000/";
  let formdata = new FormData(); //creates a form
  formdata.append("img", imagefile); //appending a input
  let reader = new FileReader();
  reader.readAsDataURL(imagefile); //reading the file for image url
  reader.onloadend = function () {
    src = reader.result; //gets the url
    fetch(url, {
      //send a post request by fetch api
      method: "POST",
      body: formdata, //image data
    })
      .then((result) => {
        //image will be displayed
        card.style.textAlign = "center";
        card.innerHTML = `<img class='check' src='check.svg'><br><h3>Uploaded Sucessfully</h3><img class='preview' src='${src}' alt='image not found'><br><div class="linkc"><input type='text' id="link" class='link'value='${src}'/><span onclick='copied()' class='button'>copy link</span></div>`;
        gallery();
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
gallery = () => {
  //displays all images from database
  var container = document.getElementById("container");
  document.getElementById("galleryheader").innerHTML = "Uploaded images";
  fetch("http://localhost:3000/images")
    .then((result) => {
      result.json().then((result) => {
        container.innerHTML = result
          .map((obj) => {
            return `<div class='gallerycolumn'><img src='uploads/${obj.img}' alt="image not found"></div>`; //single img
          })
          .join("");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
//copying the text and display text copied
copied = () => {
  var msg = document.getElementById("msg");
  var link = document.getElementById("link");
  link.select();
  link.setSelectionRange(0, 99999);
  document.execCommand("copy");
  msg.style.visibility = "visible";
  setTimeout(() => {
    msg.style.visibility = "hidden";
  }, 1000);
};
gallery(); //calling the gallery function
