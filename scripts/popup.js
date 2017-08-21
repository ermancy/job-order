//Variables
var overlay = document.getElementById('overlay');
var fab = document.getElementById('fab');
var cancel = document.getElementById('cancel');
var submit = document.getElementById('submit');

//fab click
fab.on('click', openFAB);
overlay.on('click', closeFAB);
cancel.on('click', closeFAB);

function openFAB(event) {
	if (event) event.preventDefault();
	fab.addClass('active');
	overlay.addClass('dark-overlay');
}

function closeFAB(event) {
	if (event) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}
	fab.removeClass('active');
	overlay.removeClass('dark-overlay');
}