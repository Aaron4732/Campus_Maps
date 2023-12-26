require('./controller'); //hiermit wird der server gestartet
//js code direkt im index html file drinnen
//sample code from old code
// function Auth() {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
  
//     const data = {
//       email: email,
//       password: password
//     };
//     const xhr = new XMLHttpRequest();
//     xhr.onload = function() {
//       if (xhr.status == 200) {
//         const response = JSON.parse(xhr.responseText);
//         sessionStorage.setItem("user", response.id)
//         sessionStorage.setItem("userFull", JSON.stringify(response))
//         window.location.href = "homepage.html";
//       } else {
//         console.log('Request failed. Status:', xhr.status);
//       }
//     };
//     xhr.open('GET', '/auth/' + email);
//     xhr.send();
//   }
// window.addEventListener("load", mainF);


