var canvas, ctx, eraser, img;

window.addEventListener("load", function() {
  init();
  eraser = document.getElementById("eraser");
  document.getElementById("clear").addEventListener("click", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
  document.getElementById("save").addEventListener("click", save);
  var radios = document.querySelectorAll("input[type=radio]");
  for (var i = 0; i < radios.length; i++){
  	var radio = radios[i];
  	radio.setAttribute("onclick","changeImage(this.id);");
  }
});
window.addEventListener("resize", refreshCanvasSize);
window.addEventListener("deviceorientation", refreshCanvasSize);

function changeImage(id){
	img = "./img/" + id + ".png";
	canvas.style.backgroundImage = 'url("' + img + '")';
}

var firstTime = false;
function refreshCanvasSize() {
  if (firstTime){
    var saved = new Save();
    saved.save();
    canvas.height = 0;
    canvas.width = 0;
  }
	var w = document.body.offsetWidth - 10;
	var h = (document.body.clientHeight - document.querySelector("div").clientHeight - document.querySelector("h1").clientHeight) - 100;
  canvas.width = w;
	canvas.height = h;
  console.log(h);
  if (firstTime) saved.restore();
  firstTime = true;
}

function save(){
  	var c = document.createElement("canvas");
  	c.width = canvas.width;
  	c.height = canvas.height;
  	var cx = c.getContext("2d");
  	cx.fillStyle = "white";
  	cx.fillRect(0,0,c.width,c.height);
  	var d = getBackgroundSize(canvas);
  	var i = new Image();
  	i.src = img;
  	i.onload = function(){
  		cx.drawImage(i, 0, 0, d.width, d.height);
  		cx.drawImage(canvas, 0, 0);
      //Ready to save
      c.toBlob(function(blob){
        var formData = new FormData();
        formData.append("Image", blob);
        //formSubmit({}, null, formData);
        var request = new XMLHttpRequest();
        request.open("POST", "./form/markup.php");
        request.send(formData);
      });
  	};
}

function init() {
  img = "./img/map.png";
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  refreshCanvasSize();
  var el = canvas;
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchleave", handleEnd, false);
  el.addEventListener("touchmove", handleMove, false);
  el.addEventListener("mousedown", function(event) {
    simulateTouch(event, handleStart);
  }, false);
  el.addEventListener("mouseup", function(event) {
    simulateTouch(event, handleEnd);
  }, false);
  el.addEventListener("mouseout", function(event) {
    simulateTouch(event, handleCancel);
  }, false);
  el.addEventListener("mouseout", function(event) {
    simulateTouch(event, handleEnd);
  }, false);
  el.addEventListener("mousemove", function(event) {
    simulateTouch(event, handleMove);
  }, false);
}
var ongoingTouches = new Array;

function simulateTouch(mouseEvent, callback) {
  var touch = mouseEvent;
  touch.identifier = 0;
  var evt = mouseEvent;
  evt.changedTouches = [touch];
  callback(evt);
}

function handleStart(evt) {
  evt.preventDefault();

  //  log("touchstart.");
  var el = canvas;
  var touches = evt.changedTouches;
  var offset = findPos(el);


  for (var i = 0; i < touches.length; i++) {
    if (touches[i].clientX - offset.x > 0 && touches[i].clientX - offset.x < parseFloat(el.width) && touches[i].clientY - offset.y > 0 && touches[i].clientY - offset.y < parseFloat(el.height)) {
      evt.preventDefault();
      ongoingTouches.push(copyTouch(touches[i]));
    }
  }
}

function handleMove(evt) {
  evt.preventDefault();

  var el = canvas;
  var touches = evt.changedTouches;
  var offset = findPos(el);

  for (var i = 0; i < touches.length; i++) {
    if (touches[i].clientX - offset.x > 0 && touches[i].clientX - offset.x < parseFloat(el.width) && touches[i].clientY - offset.y > 0 && touches[i].clientY - offset.y < parseFloat(el.height)) {
      evt.preventDefault();
      var color = colorForTouch(touches[i]);
      var idx = ongoingTouchIndexById(touches[i].identifier);

      if (idx >= 0) {
        if (eraser.checked) {
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineWidth = 20;
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.lineWidth = 4;
        }
        ctx.beginPath();
        ctx.moveTo(ongoingTouches[idx].clientX - offset.x, ongoingTouches[idx].clientY - offset.y);
        ctx.lineTo(touches[i].clientX - offset.x, touches[i].clientY - offset.y);
        ctx.strokeStyle = color;
        ctx.stroke();

        ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
      }
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();

  //  log("touchend/touchleave.");
  var el = canvas;
  var touches = evt.changedTouches;
  var offset = findPos(el);

  for (var i = 0; i < touches.length; i++) {
    if (touches[i].clientX - offset.x > 0 && touches[i].clientX - offset.x < parseFloat(el.width) && touches[i].clientY - offset.y > 0 && touches[i].clientY - offset.y < parseFloat(el.height)) {
      evt.preventDefault();
      var color = colorForTouch(touches[i]);
      var idx = ongoingTouchIndexById(touches[i].identifier);

      if (idx >= 0) {
        ctx.lineWidth = 4;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(ongoingTouches[idx].clientX - offset.x, ongoingTouches[idx].clientY - offset.y);
        ctx.lineTo(touches[i].clientX - offset.x, touches[i].clientY - offset.y);
        ongoingTouches.splice(i, 1); // remove it; we're done
      }
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.splice(i, 1); // remove it; we're done
  }
}

function colorForTouch(touch) {
  return "black";
}

function copyTouch(touch) {
  return {
    identifier: touch.identifier,
    clientX: touch.clientX,
    clientY: touch.clientY
  };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
}

function findPos(obj) {
  var curleft = 0,
    curtop = 0;

  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);

    return {
      x: curleft - document.body.scrollLeft,
      y: curtop - document.body.scrollTop
    };
  }
}
function getBackgroundSize(elem) {
    var computedStyle = getComputedStyle(elem),
        image = new Image(),
        src = computedStyle.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
        cssSize = computedStyle.backgroundSize,
        elemW = parseInt(computedStyle.width.replace('px', ''), 10),
        elemH = parseInt(computedStyle.height.replace('px', ''), 10),
        elemDim = [elemW, elemH],
        computedDim = [],
        ratio;
    image.src = src;
    ratio = image.width > image.height ? image.width / image.height : image.height / image.width;
    cssSize = cssSize.split(' ');
    computedDim[0] = cssSize[0];
    computedDim[1] = cssSize.length > 1 ? cssSize[1] : 'auto';
    if(cssSize[0] === 'cover') {
        if(elemDim[0] > elemDim[1]) {
            if(elemDim[0] / elemDim[1] >= ratio) {
                computedDim[0] = elemDim[0];
                computedDim[1] = 'auto';
            } else {
                computedDim[0] = 'auto';
                computedDim[1] = elemDim[1];
            }
        } else {
            computedDim[0] = 'auto';
            computedDim[1] = elemDim[1];
        }
    } else if(cssSize[0] === 'contain') {
        if(elemDim[0] < elemDim[1]) {
            computedDim[0] = elemDim[0];
            computedDim[1] = 'auto';
        } else {
            if(elemDim[0] / elemDim[1] >= ratio) {
                computedDim[0] = 'auto';
                computedDim[1] = elemDim[1];
            } else {
                computedDim[1] = 'auto';
                computedDim[0] = elemDim[0];
            }
        }
    } else {
        for(var i = cssSize.length; i--;) {
            if (cssSize[i].indexOf('px') > -1) {
                computedDim[i] = cssSize[i].replace('px', '');
            } else if (cssSize[i].indexOf('%') > -1) {
                computedDim[i] = elemDim[i] * (cssSize[i].replace('%', '') / 100);
            }
        }
    }
    if (computedDim[0] === 'auto' && computedDim[1] === 'auto') {
        computedDim[0] = image.width;
        computedDim[1] = image.height;
    } else {
        ratio = computedDim[0] === 'auto' ? image.height / computedDim[1] : image.width / computedDim[0];
        computedDim[0] = computedDim[0] === 'auto' ? image.width / ratio : computedDim[0];
        computedDim[1] = computedDim[1] === 'auto' ? image.height / ratio : computedDim[1];
    }
    return {
        width: computedDim[0],
        height: computedDim[1]
    };
}

function Save(){
  this.temp_cnvs;

  this.restore = function(){
    ctx.drawImage(this.temp_cnvs, 0, 0);
  };

  this.save = function(){
    this.temp_cnvs = document.createElement('canvas');
    var temp_cntx = this.temp_cnvs.getContext('2d');
    this.temp_cnvs.width = canvas.width; 
    this.temp_cnvs.height = canvas.height;
    temp_cntx.drawImage(canvas, 0, 0);
  }
}