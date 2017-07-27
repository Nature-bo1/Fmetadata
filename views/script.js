"use strict";

function handleSubmit() {

  if (!document.forms.fileUpload.elements.userFile.value) return;

  if (document.forms.fileUpload.elements.userFile.files[0].size >= 5000000) {
    document.getElementById("response").innerHTML = "File size limit is 5 Mb";
    return;
  }

  const xhr = new XMLHttpRequest(),
        formData = new FormData(document.forms.fileUpload);

  xhr.open("POST", "/upload", true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) {
      return;
    }
    if (xhr.status !== 200) {
      document.getElementById("response").innerHTML = "Uploading error.";
    } else {
      document.forms.fileUpload.elements.userFile.value = "";
      document.getElementById("response").innerHTML = xhr.responseText;
    }
  };

  xhr.send(formData);

}