apiHost="/api";

$.ajaxSetup({
  url: apiHost,
  dataType: "text",
  beforeSend: function(xhr) {
    loading(true);
  },
  complete: function(jqXHR, textStatus) {
    loading(false);
  }
});




const observer = new MutationObserver((mutationsList, observer) => {
  execute();
});

const config = { attributes: true, childList: true, subtree: true };
observer.observe(document.documentElement, config);

$(document).ready(function () {

  
});

function execute() { 

}
