$.ajaxSetup({
  dataType: "text",
  beforeSend: function(xhr) {
    loading(true);
  },
  complete: function(jqXHR, textStatus) {
    loading(false);
  }
});


$(document).ready(function () {
  // check login
  $.ajax({
    type: "GET",
    url: "/api/login",
    dataType: "text",
    success: function (response) {
      response = JSON.parse(atob(response));
      if (response.state) {
        loadUI("app-dashbord","#body");
      }
      else{
        console.log("LOAD LOGIN");
        loadUI("app-login","#body");
      }
    }
  });
  
 
});

function execute() {
}

function clickHendel(btn){
  switch (btn) {
    case 'login':
      hendelForm(btn);
      break;
  
    default:
      break;
  }
}

function hendelForm(event) {
  let error = false;
  data={}
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
    
    data[element.name]=element.value;
  }

  if (!error) {
    $.ajax({
      url:"/api/login",
      type: "POST",
      data: {data: btoa(JSON.stringify(data))},
      success: function (response) {
        response= (JSON.parse(atob(response)));
        if (response.state) {
          alert(response.msg, "success");
          loadUI("app-dashbod","#body")
          return;
        }
        alert("In Valid responce",'warning');
      }
    });
  }
}

// execute server oder
function responseDo(oder){
  console.log(oder);
  
}

function alert(msg, type="primary"){
  console.log("alert "+msg);
  $("#popup").html('');
  $("#popup").css("display", "block");
  $("#popup").append('<div class="alert alert-'+type+'" role="alert">'+msg+'</div>');
  setTimeout(function() {
    $("#popup").css("display", "none");
  }, 5000);

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

async function resourceManager(name){
  if (localStorage.getItem(name) == null) {
    await $.ajax({
      type: "POST",
      url: "/api/res",
      data: {
        data: btoa(JSON.stringify({
          name:name
        }))
      },
      success: function (response) {
        response = JSON.parse(atob(response));
        if (response.state) {
          localStorage.setItem(response.res[0],response.res[1]);
        }
      }
    });
  }
  return localStorage.getItem(name)
}
async function loadUI(name, perent, append=false ) {
  await resourceManager(name).then(res=>{
    let componet = atob(res);
    if (append) {
      $(perent).append(componet);
      return true;
    }
    $(perent).html(componet);
    return true;
  })

 
}