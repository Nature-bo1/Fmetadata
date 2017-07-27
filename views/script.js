"use strict";

function handleSubmit() {

  if (!document.forms.fileUpload.elements.userFile.value) return;

  var xhr = new XMLHttpRequest(),
      formData = new FormData(document.forms.fileUpload);

  xhr.open("POST", "/upload", true);

  xhr.send(formData);

  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) {
      return;
    } else if (xhr.status !== 200) {
      console.log(xhr.status + ": " + xhr.statusText);
      document.getElementById("response").innerHTML = xhr.status;
    } else {
      document.forms.fileUpload.elements.userFile.value = "";
      document.getElementById("response").innerHTML = xhr.responseText;
    }
  };
}