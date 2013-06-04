(function() {

var className = "touch-window-scrubber-handle";
var documentHeight =  Math.max(document.documentElement.clientHeight, window.innerHeight);
var bodyHeight = document.body.clientHeight;
var handle, timerFade, timerMove;

function fadeHandle(opacity, timeout) {
	clearTimeout(timerFade);
	timerFade = setTimeout(function() {
		handle.style.opacity = opacity;
	}, timeout);
}

function docTouch(event) {
	var scrollTop = document.body.scrollTop;

	if (scrollTop < 10) {
		handle.style.opacity = 0;
	} else if (event.type === "touchend") {
		handle.style.opacity = 0.5;
	}
}

function docMove(event) {
	var scrollTop = document.body.scrollTop;

	handle.style.opacity = 0;
	clearTimeout(timerMove);
	timerMove = setTimeout(function() {
		handle.style.top = parseInt((scrollTop / bodyHeight) * documentHeight, 10) + "px";
	});
}

function handleMove(event) {
	var clientY = event.targetTouches[0].clientY;
	var percent = Math.max(Math.min(clientY / documentHeight, 1), 0);
	var handleY = Math.min(parseInt(percent * documentHeight, 10), documentHeight);
	var scrollToY = parseInt(percent * bodyHeight, 10);

	event.cancelBubble = true;
	handle.style.top = handleY + "px";
	window.scrollTo(0, scrollToY);
}

function handleEnd(event) {
	event.cancelBubble = true;
	fadeHandle(0, 1000);
}

document.addEventListener("touchstart", docTouch, false);
document.addEventListener("touchend", docTouch, false);
document.addEventListener("touchmove", docMove, false);

handle = document.createElement("div");
handle.addEventListener("touchmove", handleMove, false);
handle.addEventListener("touchend", handleEnd, false);
handle.classList.add(className);
handle = document.body.appendChild(handle);

})();