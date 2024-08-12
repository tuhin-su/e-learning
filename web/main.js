apiHost="http://192.168.43.163/api";
document.getElementById("boot-script").remove();
document.getElementById("boot-sass").remove();


$(document).ready(function () {
  $('html').bind('DOMNodeInserted', function() {
    exeute();
  });

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
        UI("app-login");
      }
      else{
        UI("app-dashbord");
      }
    }
  });
});


// function for pages
function exeute(){
    $('.btn').click(function () { 
      if ($(this).attr('fromname')) {
        hendelForm($(this).attr('fromname'));
      }
    });
}

// hendel froms
function hendelForm(event) {
  let error = false;
  data={
    "reqFor":"form",
    "form":event,
    "data": {}
  }
  validation = {};
  let inputs = (document.getElementById(event)).getElementsByTagName("input");
  for (let index = 0; index < inputs.length; index++) {
    const element = inputs[index];
    error=false;
    if($(element).attr('required')){
      validation["required"]=true;
    }

    if ($(element).attr('pattern')) {
      validation["pattern"] = ($(element).attr('pattern'));
    }

    if (!inputValidation(element.value, validation)) {
      error=true;
      msg = element.placeholder+" not valid!"
      alert(msg);
      return;
    }
    
    data.data[element.name]=element.value;
  }

  if (!error) {
    $.ajax({
      type: "POST",
      url: apiHost,
      data: {data:jsonToBase64(data)},
      dataType: "text",
      success: function (response) {
        response=(base64ToJson((response)));
        if (response.state.state) {
          alert(response.state.msg, "success");
          if (response.do) {
            responseDo(response.do);
            return;
          }
        }
        alert("In Valid responce",'warning');
      }
    });
  }
}

// execute server oder
function responseDo(oder){
  if (oder.redirect) {
    // UI(oder.redirect);
  }
}

function alert(msg, type="primary"){
  $("#popup").html('');
  $("#popup").css("display", "block");
  $("#popup").append('<div class="alert alert-'+type+'" role="alert">'+msg+'</div>');
  setTimeout(function() {
    $("#popup").css("display", "none");
}, 2000);

}
// input validation pattern="^[a-zA-Z0-9]+$"
function inputValidation(string, validation) {
  string = String(string).trim()
  if (validation.required) {
    if (string == null || string === '' ) {
      return false;
    }
  }
  if (validation.pattern) {
    return isMatch(validation.pattern, string);
  }
  return true;
}

// patten
function isMatch(patternStr, str) {
  try {
      const pattern = new RegExp(patternStr);
      return pattern.test(str);
  } catch (e) {
      console.error("Invalid pattern:", e.message);
      return false;
  }
}

// function for build UI
function UI(name) { 
    resourceManager(name).then((res) => {
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