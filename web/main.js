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


  $.ajax({
    type: "POST",
    url: apiHost,
    data: {
        data: jsonToBase64(
          {
            "reqFor":"auth",
            "token":"abc"
          }
        )
    },
    dataType: "text",
    success: function (response) {
      response = (base64ToJson(response));
      if(!response.state.state){
        UI("app-login");
      }
      else{
        UI("app-dashbord");
      }
    }
  });
});

function exeute(){
    // load page funcion
}

function UI(name) { 
    resourceManager("app-login").then((res) => {
      if(typeof(res) === "object"){
        if (res[2]==="comp") {
          let tag = document.createElement('div');
          tag.id = res[0];

          let compCode = JSON.parse(atob(res[1]));
          for (let index = 0; index < compCode.length; index++) {
            let contex = appBuilder(compCode[index]);
            if(contex["append"]){
              $(contex["perent"]).append(contex.dom);
            }
            $(contex["perent"]).html(contex.dom);
          }
          return true;
        }
        return false;
      }
      return false;
      });
 }


 function appBuilder(obj){
    let returnble = {};
    returnble["append"]=false;

    let tag = document.createElement(obj.name);
    // set tags
    if (obj.attribute) {
      let keys =Object.keys(obj.attribute);
      for (let index = 0; index < keys.length; index++) {
        $(tag).attr(keys[index], obj.attribute[keys[index]]);
      }
    }
    // set children
    if (obj.children) {
      for (let index = 0; index < obj.children.length; index++) {
        $(tag).append(appBuilder(obj.children[index]).dom);
      }
    }
    // set text
    if (obj.content) {
      $(tag).append(obj.content);
    }

    // append
    if (obj.append) {
      returnble["append"]=true;
    }

    // perent tag  and id
    if (obj.perent) {
      returnble["perent"]=obj.perent;
    }

    returnble["dom"]=tag;
    return returnble;
 }