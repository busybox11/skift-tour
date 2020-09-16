// This code is messy. sorry :(
// I'm warning you.

var is_debug = false;

var time_vue = new Vue({
  el: "#time",
  data: {
    time: "09:12:32",
  },
  methods: {
    get_time: function () {
      var now = new Date();
      var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
      return time;
    }
  }
});

function menu_hide()
{
  $("#menu").css("display", "none");
}

function menu_show()
{
  $("#menu").css("display", "flex");
}

function get_id(name)
{
  var id = 0;
  for(var i = 0; i < document.getElementsByTagName('*').length; i++)
  {
    if(document.getElementById(name + i.toString() + "-window"))
    {
      id++;
    }
  }
  id = id.toString()
  return id;
}

function window_create(parent, name, icon = "application", type = "standard", title, width, height, x, y, html)
{
  // The ID allows multiple instances of a window
  var id = get_id(name);

  if (x == undefined) { x = "90px"; }
  if (y == undefined) { y = "90px"; }

  var titlebar_html =
    `<div class="titlebar" id="` + name + id  + `-titlebar">
<i class="mdi mdi-` + icon + `" aria-hidden="true"></i>
<span id="` + name + id + `-title"> ` + title + `</span>`;
  titlebar_html += `<button class="normal-button titlebar-button" id="` + name + id + `-close" onclick="window_close('` + name + id + `-window')"><i class="mdi mdi-close-circle" aria-hidden="true"></i></button>`;
  if (type == "standard") {
    titlebar_html += `<button class="normal-button titlebar-button" id="` + name + id + `-maximize" onclick="window_maximize('` + name + id + `-window')"><i class="mdi mdi-plus" aria-hidden="true"></i></button>`;
    titlebar_html += `<button class="normal-button titlebar-button" id="` + name + id + `-minimize"><i class="mdi mdi-minus" aria-hidden="true"></i></button>`;
  }
  titlebar_html += "</div>";

  var p = document.getElementById(parent);
  var el = document.createElement("div");
  el.setAttribute("id", name + id + "-window");
  el.setAttribute("class", "window");
  el.setAttribute("style", "width: " + width + "; " + "height: " + height);
  el.innerHTML = titlebar_html + html;
  el.style.top = (el.offsetTop + x);
  el.style.left = (el.offsetLeft + y);


  p.appendChild(el);
  element_allow_dragging(el, name + id + "-titlebar");

  return {
      window_id: name + id + "-window",
      identifer: id,
    };
}

var update_clock = setInterval(function () {
  time_vue.$forceUpdate();
}, 1000);

$("#about-menu-item").click(function () {
  menu_hide();
  var window = window_create("desktop", "about", "information", "dialogue", "About", "250px", "245px", undefined, undefined, `<center>
<div style="background-image: url('https://raw.githubusercontent.com/skiftOS/skift/master/applications/about/logo-white.png');height: 60px; background-repeat: no-repeat; background-position: center;">
</div>
<a href="https://www.github.com/skiftOS/skift" class="link">The skift operating system.</a>
<br><br>
<p>All artwork featured on this page belongs their respective owners</p>
<br>
<p>This is a demo</p>
<br>
<button class="accent-button" id="about` + get_id("about") + `-ok-btn" style="height: 35px; float: right; padding-left: 35px; padding-right: 35px;">Ok</button>
</center>`);
  $("#" + "about" + window.identifer + "-ok-btn").click(function () {
    window_close(window.window_id);
  });
});

$("#settings-menu-item").click(function () {
  menu_hide();
  window_create("desktop", "settings", "cog", "standard", "Settings", "700px", "500px", undefined, undefined, "<center>Work in progress</center>");
});

$("#calc-menu-item").click(function () {
  menu_hide();
  window_create("desktop", "calc", "calculator-variant", "standard", "Calculator", "260px", "323px", undefined, undefined, `
<div class="calc-box">#value</div>
<button class="normal-button outline calc-btn"><i class="mdi mdi-percent" aria-hidden="true"></i></button> <button class="normal-button outline calc-btn">CE</button> <button class="normal-button outline calc-btn">C</button> <button class="normal-button outline calc-btn"><i class="mdi mdi-backspace-outline" aria-hidden="true"></i></button>
<button class="normal-button outline calc-btn">1/x</button> <button class="normal-button outline calc-btn"><i class="mdi mdi-exponent" aria-hidden="true"></i></button> <button class="normal-button outline calc-btn"><i class="mdi mdi-square-root" aria-hidden="true"></i></button> <button class="normal-button outline calc-btn"><i class="mdi mdi-slash-forward" aria-hidden="true"></i></button>
<button class="normal-button calc-btn">7</button> <button class="normal-button calc-btn">8</button> <button class="normal-button calc-btn">9</button> <button class="normal-button outline calc-btn"><i class="mdi mdi-close" aria-hidden="true"></i></button>
<button class="normal-button calc-btn">4</button> <button class="normal-button calc-btn">5</button> <button class="normal-button calc-btn">6</button> <button class="normal-button outline calc-btn"><i class="mdi mdi-minus" aria-hidden="true"></i></button>
<button class="normal-button calc-btn">1</button> <button class="normal-button calc-btn">2</button> <button class="normal-button calc-btn">3</button> <button class="normal-button outline calc-btn"><i class="mdi mdi-plus" aria-hidden="true"></i></button>
<button class="normal-button outline calc-btn"><i class="mdi mdi-plus-minus-variant" aria-hidden="true"></i></button> <button class="normal-button calc-btn">0</button> <button class="normal-button outline calc-btn">.</button> <button class="accent-button calc-btn"><i class="mdi mdi-equal" aria-hidden="true"></i></button>
`);
});

$("#applications_btn").click(function () {
  menu_show();
});

if (!is_debug) {
  $(window).contextmenu(function () {
    return false;
  });
  $("body").css("overflow", "hidden");
}

$(window).click(function () {
  menu_hide();
});

$('#applications_btn').click(function (event) {
  event.stopPropagation();
});

$('#menu').click(function (event) {
  event.stopPropagation();
});

// Window controls
function window_close(element_id) {
  var element = document.getElementById(element_id);
  element.parentNode.removeChild(element);
}

function window_maximize(element_id) {
  // FIXME: not right (it's a problem (fixed values (causes problems (with smaller screens)))
  $("#" + element_id).css("width", "99.4%");
  $("#" + element_id).css("height", "94%");
  $("#" + element_id).offset({ top: 39, left: 0 });
}

// Window dragging
function element_allow_dragging(element, titlebar_id) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(titlebar_id)) {
    document.getElementById(titlebar_id).onmousedown = dragMouseDown;
  } else {
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
