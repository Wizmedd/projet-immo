
function autocomplete(inp, arr) {
  var currentFocus;
  var selectedValues = []; // table qui stocke les villes déjà sélectionnées
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        // si la ville n'est pas déjà sélectionnée, on l'ajoute à la liste
        if (selectedValues.indexOf(arr[i]) === -1) {
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          b.addEventListener("click", function (e) {
            inp.value = "";
            selectedValues.push(this.getElementsByTagName("input")[0].value); // ajoute la ville sélectionnée à la liste
            updateSelectedValues(); // met à jour l'affichage des villes sélectionnées
          });
          a.appendChild(b);
        }
      }
    }
  });
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  function updateSelectedValues() {
    const selectedDiv = document.getElementById("selected-values");
    selectedDiv.innerHTML = "";

    selectedValues.forEach((value) => {
      const div = document.createElement("DIV");
      div.classList.add("bg-light", "m-1", "p-1", "rounded", "border", "d-flex", "align-items-center");

      const span = document.createElement("SPAN");
      span.classList.add("badge", "bg-secondary", "me-2", "my-2");
      span.innerText = value;

      const closeButton = document.createElement("BUTTON");
      closeButton.setAttribute("type", "button");
      closeButton.classList.add("btn-close");
      closeButton.classList.add("btn-sm");
      closeButton.setAttribute("aria-label", "Close");
      closeButton.setAttribute("data-value", value);

      // Add a click event listener to remove the selected value
      closeButton.addEventListener("click", (event) => {
        const valueToRemove = event.target.getAttribute("data-value");
        const indexToRemove = selectedValues.indexOf(valueToRemove);
        if (indexToRemove !== -1) {
          selectedValues.splice(indexToRemove, 1);
          updateSelectedValues();
        }
      });

      div.appendChild(span);
      div.appendChild(closeButton);
      selectedDiv.appendChild(div);
    });
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
