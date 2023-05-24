function save_options() {
  let default_documents_dir = document.getElementById(
    "default_documents_dir"
  ).value;

  chrome.storage.sync.set(
    {
      default_documents_dir: default_documents_dir,
    },
    function () {
      var status = document.getElementById("status");
      status.textContent = "option saved";
      // setTimeout(function () {
      //   status.textContent = "";
      // }, 1500);
    }
  );
}

function default_options() {
  chrome.storage.sync.get(
    {
      default_documents_dir: "/Users/user/Downloads",
    },
    function (items) {
      document.getElementById("default_documents_dir").value =
        items.default_documents_dir;
    }
  );
}
document.addEventListener("DOMContentLoaded", default_options);
document.getElementById("set_button").addEventListener("click", save_options);
