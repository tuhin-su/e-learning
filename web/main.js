apiHost="http://192.168.43.163/api";
document.getElementById("boot-script").remove();
document.getElementById("boot-sass").remove();

$(document).ready(function () {
  resourceManager("main-css").then((res) => {
    obj = resourceBuilder(res);
    if (obj) {
      document.head.appendChild(obj);
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
          }
        )
    },
    dataType: "text",
    success: function (response) {
      response = (base64ToJson(response));
      if(!response.state.state){
        UI("app-login","#body");
      }
      else{
        UI("app-dashbord","#body");
      }
    }
  });

  exeute();
});

// detect dom chande
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function(mutations, observer) {
    exeute();
});

observer.observe(document, {
  subtree: true,
  attributes: true
});


// function for pages
function exeute(){
    $('.btn').click(function (e) { 
      console.log(e)
    });
}

function UI(name,perent) { 
    resourceManager("app-login").then((res) => {
      if(typeof(res) === "object"){
        if (res[2]==="comp") {
          // $(perent).html(atob(res[1]));
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

    // src 
    if (obj.src) {
      if (String(obj.src).includes("http://") || String(obj.src).includes("https://")) {
        tag.src=obj.src;
      }
      else
      {
        resourceManager(obj.src).then((res) => {
          tag.src="data:image/png;base64,"+res[1];
        });
      }
    }

    // requrment
    if (obj.requrment) {
      for (let index = 0; index < obj.requrment.length; index++) {
        const element = obj.requrment[index];
        if (!document.getElementById(element)) {
          resourceManager(element).then((res) => {
            reso= resourceBuilder(res);
            if (reso) {
              $(tag).append(reso);
            }
          });
        }
        
      }
    }

    returnble["dom"]=tag;
    return returnble;
 }