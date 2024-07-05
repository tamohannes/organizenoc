function save_options() {
  let documents_root_dir = document.getElementById(
    "documents_root_dir"
  ).value;

  chrome.storage.sync.set(
    {
      documents_root_dir: documents_root_dir,
    },
    function () {
      var status = document.getElementById("status");
      status.textContent = "option saved";
      setTimeout(function () {
        status.textContent = "";
      }, 1500);
    }
  );
}

function default_options() {
  chrome.storage.sync.get(
    {
      documents_root_dir: default_root_dir,
    },
    function (items) {
      document.getElementById("documents_root_dir").value =
        items.documents_root_dir;
    }
  );
}
document.addEventListener("DOMContentLoaded", default_options);
document.getElementById("set_button").addEventListener("click", save_options);
