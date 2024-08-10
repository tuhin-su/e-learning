apiHost="http://localhost/api";
$(document).ready(function () {
  
  resourceManager("bootstrap-css").then((res) => {
    obj = resourceBuilder(res);
    if (obj) {
      document.head.appendChild(obj);
    }
  });

  resourceManager("bootstrap-js").then((res) => {
    obj = resourceBuilder(res);
    if (obj) {
      document.body.appendChild(obj);
    }
  });
  
  // check session login token
  data={
    "reqFor":"Auth",
    "token":"abc"
  }

  $.ajax({
    type: "POST",
    url: apiHost,
    data: {
        data: jsonToBase64(data)
    },
    dataType: "text",
    success: function (response) {
        console.log(base64ToJson(response));
    }
  });
  // detect old page

  // load page
});

function exeute(){
    // load page funcion
}

function UI(name) { 
    resourceManager("app-login").then((res) => {
        obj = appBuilder(res);
        if (obj) {
          document.body.appendChild(obj);
        }
      });
 }


 function appBuilder(obj){
    console.log(obj)
 }