/*
Copyright 2013 Michael Costello.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Author: Michael Costello (michael.a.costello@gmail.com)
*/

(function() {

var className = "touch-window-scrubber-handle";
var win = window;
var docElm = document.documentElement;
var body = document.body;
var viewportHeight, documentHeight, handle, timerFade, timerMove;

function fadeHandle(opacity, timeout) {
	clearTimeout(timerFade);
	timerFade = setTimeout(function() {
		handle.style.opacity = opacity;
	}, timeout);
}

function getDocumentHeight() {
	return Math.max(
		body.scrollHeight, docElm.scrollHeight,
		body.offsetHeight, docElm.offsetHeight,
		docElm.clientHeight
	);
}

// @see https://github.com/ryanve/response.js/issues/17
function getViewportHeight() {
	var mM = win.matchMedia || win.msMatchMedia;
	var client = docElm["clientHeight"];
	var inner = win["innerHeight"];

	return ( mM && client < inner && true === mM("(min-height:" + inner + "px)")["matches"] ? inner : client );
}

function docTouch(event) {
	var scrollTop = body.scrollTop;

	// refresh cached heights
	if (event.type === "touchstart") {
		viewportHeight = getViewportHeight();
		documentHeight = getDocumentHeight();
	}

	if (scrollTop < 10) {
		handle.style.opacity = 0;
	} else if (event.type === "touchend") {
		handle.style.opacity = 0.5;
		fadeHandle(0, 1200);
	}
}

function docMove(event) {
	var scrollTop = body.scrollTop;

	handle.style.opacity = 0;
	clearTimeout(timerMove);
	timerMove = setTimeout(function() {
		handle.style.top = parseInt((scrollTop / documentHeight) * viewportHeight, 10) + "px";
	});
}

function handleMove(event) {
	var clientY = event.targetTouches[0].clientY;
	var percent = Math.max(Math.min(clientY / viewportHeight, 1), 0);
	var handleY = Math.min(parseInt(percent * viewportHeight, 10), viewportHeight);
	var scrollToY = parseInt(percent * documentHeight, 10);

	event.stopPropagation();
	handle.style.top = handleY + "px";
	win.scrollTo(0, scrollToY);
}

function handleEnd(event) {
	event.stopPropagation();
	fadeHandle(0, 1200);
}

document.addEventListener("touchstart", docTouch, false);
document.addEventListener("touchend", docTouch, false);
document.addEventListener("touchmove", docMove, false);

handle = document.createElement("div");
handle.addEventListener("touchmove", handleMove, false);
handle.addEventListener("touchend", handleEnd, false);
handle.classList.add(className);
handle = body.appendChild(handle);

})();