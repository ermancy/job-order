'use strict';

// Initializes JobOrder.
function JobOrder() {
	this.checkSetup();

	// Shortcuts to DOM Elements.
	this.updateForm = document.getElementById('update-form');
	this.orderForm = document.getElementById('order-form');
	this.updateForm = document.getElementById('update-form');
	this.stockForm = document.getElementById('stock-form');
	this.consumeForm = document.getElementById('consume-form')
	this.orderList = document.getElementById('orders');
	this.stockList = document.getElementById('stocks');

	this.ordersCardContainer = document.getElementById('orders-card-container');
	this.stocksCardContainer = document.getElementById('stocks-card-container');

	this.jobOrderDrawer = document.getElementById('job-order-drawer');
	this.stockDrawer = document.getElementById('stocks-drawer');

	this.jobOrderNoInput = document.getElementById('job-order-no');
	this.customerNameInput = document.getElementById('customer-name');
	this.orderTypeInput = document.getElementById('order-type');
	this.orderSizeInput = document.getElementById('order-size');
	this.jobCountInput = document.getElementById('job-count');
	this.printMachineInput = document.getElementById('print-machine');
	this.plateTypeInput = document.getElementById('plate-type');
	this.bindingInput = document.getElementById('binding');
	this.notesInput = document.getElementById('notes');
	this.customerRepInput = document.getElementById('customer-rep');
	this.paperWeightInput = document.getElementById('paper-weight');
	this.paperTypeInput = document.getElementById('paper-type');
	this.paperSizeInput = document.getElementById('paper-size');
	this.printSizeInput = document.getElementById('print-size');
	this.printCountInput = document.getElementById('print-count');
	this.actualCountInput = document.getElementById('actual-count');
	this.leafCountInput = document.getElementById('leaf-count');
	this.pageCountInput = document.getElementById('page-count');
	this.colorCountInput = document.getElementById('color-count');
	this.postApplicationInput = document.getElementById('post-application');
	this.coverPaperWeightInput = document.getElementById('cover-paper-weight');
	this.coverPaperTypeInput = document.getElementById('cover-paper-type');
	this.coverPaperSizeInput = document.getElementById('cover-paper-size');
	this.coverPrintSizeInput = document.getElementById('cover-print-size');
	this.coverPrintCountInput = document.getElementById('cover-print-count');
	this.coverActualCountInput = document.getElementById('cover-actual-count');
	this.coverLeafCountInput = document.getElementById('cover-leaf-count');
	this.coverPageCountInput = document.getElementById('cover-page-count');
	this.coverColorCountInput = document.getElementById('cover-color-count');
	this.coverPostApplicationInput = document.getElementById('cover-post-application');
	
	this.jobOrderNoUpdateInput = document.getElementById('job-order-no-update');
	this.customerNameUpdateInput = document.getElementById('customer-name-update');
	this.orderTypeUpdateInput = document.getElementById('order-type-update');
	this.orderSizeUpdateInput = document.getElementById('order-size-update');
	this.jobCountUpdateInput = document.getElementById('job-count-update');
	this.printMachineUpdateInput = document.getElementById('print-machine-update');
	this.plateTypeUpdateInput = document.getElementById('plate-type-update');
	this.bindingUpdateInput = document.getElementById('binding-update');
	this.notesUpdateInput = document.getElementById('notes-update');
	this.customerRepUpdateInput = document.getElementById('customer-rep-update');
	this.paperWeightUpdateInput = document.getElementById('paper-weight-update');
	this.paperTypeUpdateInput = document.getElementById('paper-type-update');
	this.paperSizeUpdateInput = document.getElementById('paper-size-update');
	this.printSizeUpdateInput = document.getElementById('print-size-update');
	this.printCountUpdateInput = document.getElementById('print-count-update');
	this.actualCountUpdateInput = document.getElementById('actual-count-update');
	this.leafCountUpdateInput = document.getElementById('leaf-count-update');
	this.pageCountUpdateInput = document.getElementById('page-count-update');
	this.colorCountUpdateInput = document.getElementById('color-count-update');
	this.postApplicationUpdateInput = document.getElementById('post-application-update');
	this.coverPaperWeightUpdateInput = document.getElementById('cover-paper-weight-update');
	this.coverPaperTypeUpdateInput = document.getElementById('cover-paper-type-update');
	this.coverPaperSizeUpdateInput = document.getElementById('cover-paper-size-update');
	this.coverPrintSizeUpdateInput = document.getElementById('cover-print-size-update');
	this.coverPrintCountUpdateInput = document.getElementById('cover-print-count-update');
	this.coverActualCountUpdateInput = document.getElementById('cover-actual-count-update');
	this.coverLeafCountUpdateInput = document.getElementById('cover-leaf-count-update');
	this.coverPageCountUpdateInput = document.getElementById('cover-page-count-update');
	this.coverColorCountUpdateInput = document.getElementById('cover-color-count-update');
	this.coverPostApplicationUpdateInput = document.getElementById('cover-post-application-update');
	
	this.stockNoInput = document.getElementById('stock-no');
	this.stockJobOrderNoInput = document.getElementById('stock-job-order-no');
	this.stockPaperTypeInput = document.getElementById('stock-paper-type');
	this.stockPaperCountInput = document.getElementById('stock-paper-count');
	this.stockPaperWeightInput = document.getElementById('stock-paper-weight');
	this.stockPaperSizeInput = document.getElementById('stock-paper-size');
	this.stockPaperUnitPriceInput = document.getElementById('stock-paper-unit-price');

	this.consumeDateInput = document.getElementById('consume-date');
	this.consumeJobOrderNoInput = document.getElementById('consume-job-order-no');
	this.consumePaperTypeInput = document.getElementById('consume-paper-type');
	this.consumePaperCountInput = document.getElementById('consume-paper-count');
	this.consumePaperWeightInput = document.getElementById('consume-paper-weight');
	this.consumePaperSizeInput = document.getElementById('consume-paper-size');
	this.consumePaperUnitPriceInput = document.getElementById('consume-paper-unit-price');

	this.submitButton = document.getElementById('submit');
	this.clearButton = document.getElementById('orders-clear');
	this.cancelButton = document.getElementById('orders-cancel');
	this.userName = document.getElementById('user-name');
	this.email = document.getElementById('email');
	this.password = document.getElementById('password');
	this.emailBox = document.getElementById('email-box');
	this.passwordBox = document.getElementById('password-box');
	this.signInButton = document.getElementById('sign-in');
	this.signOutButton = document.getElementById('sign-out');
	this.signInSnackbar = document.getElementById('must-signin-snackbar');
	
	this.stocksClearButton = document.getElementById('stocks-clear');
	
	this.updateButton = document.getElementById('update-button');

	this.ORDER_TEMPLATE =
	'<div class="order-container">' +
		'<div class="jobOrderNo"></div>' +
		'<div class="jobOrderDate"></div>' +
		'<div class="customerName"></div>' +
		'<div class="customerRep"></div>' +
		'<div class="orderType"></div>' +
		'<button class="detailButton mdl-button mdl-js-button mdl-button--raised">Detay</button>' +
	'</div>';
	
	this.STOCK_TEMPLATE =
	'<div class="stock-container">' +
		'<div class="stockNo"></div>' +
		'<div class="stockDate"></div>' +
		'<div class="stockPaperWeight"></div>' +
		'<div class="stockPaperType"></div>' +
		'<div class="stockPaperSize"></div>' +
		'<div class="stockPaperCount"></div>' +
		'<div class="stockPaperLast"></div>' +
		'<div class="stockPaperUnitPrice"></div>' +
		'<button class="consumeButton mdl-button mdl-js-button mdl-button--raised">Kullan</button>' +
	'</div>';
	
	this.STOCK_USED_TEMPLATE =
	'<div class="stock-used-container">' +
		'<div class="stockJobOrderNo"></div>' +
		'<div class="stockJobOrderPaperCount"></div>' +
		'<div class="stockConsumePaperNotes"></div>' +
	'</div>';
	
	this.LIST_TEMPLATE = '<li class="mdl-menu__item"></li>';

	// Saves order on form submit.
	this.orderForm.addEventListener('submit', this.saveOrder.bind(this));
	this.updateForm.addEventListener('submit', this.updateOrder.bind(this));
	
	// Saves stock on form submit.
	this.stockForm.addEventListener('submit', this.saveStock.bind(this));

	// Updates stock on form submit.
	this.consumeForm.addEventListener('submit', this.updateStock.bind(this));

	this.signOutButton.addEventListener('click', this.signOut.bind(this));
	this.signInButton.addEventListener('click', this.signIn.bind(this));

	this.jobOrderDrawer.addEventListener('click', this.toggleDrawer.bind(this));
	this.stockDrawer.addEventListener('click', this.toggleDrawer.bind(this));

	// Toggle for the button.
	var buttonTogglingHandler = this.toggleButton.bind(this);
	this.jobOrderNoInput.addEventListener('keyup', buttonTogglingHandler);
	this.jobOrderNoInput.addEventListener('change', buttonTogglingHandler);
	
	this.cancelButton.addEventListener('click', function(){
		document.getElementById('orders-card').removeAttribute('hidden');
		document.getElementById('submit-card').setAttribute('hidden', 'true');
		
		document.getElementById('submit').setAttribute('disabled', 'true');
		document.getElementById('orders-clear').setAttribute('disabled', 'true');
		document.getElementById('orders-cancel').setAttribute('disabled', 'true');
	}.bind(this));

	document.getElementById('update-cancel').addEventListener('click', function(){
		document.getElementById('orders-card').removeAttribute('hidden');
		document.getElementById('update-card').setAttribute('hidden', 'true');
		
		document.getElementById('update-button').setAttribute('disabled', 'true');
		document.getElementById('update-clear').setAttribute('disabled', 'true');
		document.getElementById('update-cancel').setAttribute('disabled', 'true');
	}.bind(this));
	
	document.getElementById('orders-new').addEventListener('click', function(){
		document.getElementById('orders-card').setAttribute('hidden', 'true');
		document.getElementById('submit-card').removeAttribute('hidden');
		
		document.getElementById('submit').removeAttribute('disabled');
		document.getElementById('orders-clear').removeAttribute('disabled');
		document.getElementById('orders-cancel').removeAttribute('disabled');
	}.bind(this));

	document.getElementById('stocks-new').addEventListener('click', function(){
		document.getElementById('stocks-card').setAttribute('hidden', 'true');
		document.getElementById('stock-in-card').removeAttribute('hidden');
		
		document.getElementById('stock-submit').removeAttribute('disabled');
		document.getElementById('stocks-clear').removeAttribute('disabled');
		document.getElementById('stocks-cancel').removeAttribute('disabled');
	}.bind(this));

	document.getElementById('stocks-cancel').addEventListener('click', function(){
		document.getElementById('stocks-card').removeAttribute('hidden');
		document.getElementById('stock-in-card').setAttribute('hidden', 'true');
		
		document.getElementById('stock-submit').setAttribute('disabled', 'true');
		document.getElementById('stocks-clear').setAttribute('disabled', 'true');
		document.getElementById('stocks-cancel').setAttribute('disabled', 'true');
	}.bind(this));

	document.getElementById('consume-cancel').addEventListener('click', function(){
		document.getElementById('stocks-card').removeAttribute('hidden');
		document.getElementById('stock-out-card').setAttribute('hidden', 'true');
		document.getElementById('stock-used-card').setAttribute('hidden', 'true');
		document.getElementById('stock-info-card').setAttribute('hidden', 'true');
		
		document.getElementById('consume-submit').setAttribute('disabled', 'true');
		document.getElementById('consume-clear').setAttribute('disabled', 'true');
	}.bind(this));

	this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
JobOrder.prototype.initFirebase = function() {
	// Shortcuts to Firebase SDK features.
	this.auth = firebase.auth();
	this.database = firebase.database();
	this.storage = firebase.storage();

	// Initiates Firebase auth and listen to auth state changes.
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Sets the URL of the given img element with the URL of the image stored in Cloud Storage.
JobOrder.prototype.setImageUrl = function(imageUri, imgElement) {
	
	// If the image is a Cloud Storage URI we fetch the URL.
	if (imageUri.startsWith('gs://')) {
		imgElement.src = JobOrder.LOADING_IMAGE_URL; // Display a loading image first.
		this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
			imgElement.src = metadata.downloadURLs[0];
		});
	} else {
		imgElement.src = imageUri;
	}

};

// Signs-in Job Order.
JobOrder.prototype.signIn = function() {
	// Sign in Firebase using popup auth and Google as the identity provider.
	var provider = new firebase.auth.EmailAuthProvider();
	this.auth.signInWithEmailAndPassword(this.email.value, this.password.value);
	this.email.value = '';
	this.password.value = '';
};

// Signs-out of Job Order.
JobOrder.prototype.signOut = function() {
	// Sign out of Firebase.
	this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
JobOrder.prototype.onAuthStateChanged = function(user) {
	if (user) { // User is signed in!
		var userName = user.email;

		// Set the user's profile name.
		this.userName.textContent = userName;

		// Show user's profile and sign-out button.
		this.userName.removeAttribute('hidden');
		this.signOutButton.removeAttribute('hidden');

		// Hide sign-in button.
		this.signInButton.setAttribute('hidden', 'true');
		this.emailBox.setAttribute('hidden', 'true');
		this.passwordBox.setAttribute('hidden', 'true');

		// We load currently existing chant orders.
		this.loadOrders();
		this.loadStocks();

		// We save the Firebase Messaging Device token and enable notifications.
		this.saveMessagingDeviceToken();
	} else { // User is signed out!
		// Hide user's profile and sign-out button.
		this.userName.setAttribute('hidden', 'true');
		//this.userPic.setAttribute('hidden', 'true');
		this.signOutButton.setAttribute('hidden', 'true');

		// Show sign-in button.
		this.signInButton.removeAttribute('hidden');
		this.emailBox.removeAttribute('hidden');
		this.passwordBox.removeAttribute('hidden');
	}
};

// Returns true if user is signed-in. Otherwise false and displays a message.
JobOrder.prototype.checkSignedInWithMessage = function() {
	// Return true if the user is signed in Firebase
	if (this.auth.currentUser) {
		return true;
	}

	// Display a order to the user using a Toast.
	var data = {
		message: 'Önce Giriş Yapmalısın!',
		timeout: 2000
	};
	this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
	return false;
};

// Saves the messaging device token to the datastore.
JobOrder.prototype.saveMessagingDeviceToken = function() {
	firebase.messaging().getToken().then(function(currentToken) {
		if (currentToken) {
			console.log('Got FCM device token:', currentToken);
			// Saving the Device Token to the datastore.
			firebase.database().ref('/fcmTokens').child(currentToken)
					.set(firebase.auth().currentUser.uid);
		} else {
			// Need to request permissions to show notifications.
			this.requestNotificationsPermissions();
		}
	}.bind(this)).catch(function(error){
		console.error('Unable to get messaging token.', error);
	});
};

// Requests permissions to show notifications.
JobOrder.prototype.requestNotificationsPermissions = function() {
	console.log('Requesting notifications permission...');
	firebase.messaging().requestPermission().then(function() {
		// Notification permission granted.
		this.saveMessagingDeviceToken();
	}.bind(this)).catch(function(error) {
		console.error('Unable to get permission to notify.', error);
	});
};

// Resets the given MaterialTextfield.
JobOrder.prototype.resetMaterialTextfield = function() {
	//this.querySelector('.mdl-textfield__input').parentNode.MaterialTextField.boundUpdateClassesHandler();

	this.jobOrderNoInput.value='';
	this.jobOrderNoInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.customerNameInput.value='';
	this.customerNameInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.orderTypeInput.value='';
	this.orderTypeInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.orderSizeInput.value='';
	this.orderSizeInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.jobCountInput.value='';
	this.jobCountInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.printMachineInput.value='';
	this.printMachineInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.plateTypeInput.value='';
	this.plateTypeInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.bindingInput.value='';
	this.bindingInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.notesInput.value='';
	this.notesInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.customerRepInput.value='';
	this.customerRepInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.paperWeightInput.value='';
	this.paperWeightInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.paperTypeInput.value='';
	this.paperTypeInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.paperSizeInput.value='';
	this.paperSizeInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.printSizeInput.value='';
	this.printSizeInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.printCountInput.value='';
	this.printCountInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.actualCountInput.value='';
	this.actualCountInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.leafCountInput.value='';
	this.leafCountInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.pageCountInput.value='';
	this.pageCountInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.colorCountInput.value='';
	this.colorCountInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.postApplicationInput.value='';
	this.postApplicationInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.coverPaperWeightInput.value='';
	this.coverPaperWeightInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.coverPaperTypeInput.value='';
	this.coverPaperTypeInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.coverPaperSizeInput.value='';
	this.coverPaperSizeInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.coverPrintSizeInput.value='';
	this.coverPrintSizeInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.coverPrintCountInput.value='';
	this.coverPrintCountInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.coverActualCountInput.value='';
	this.coverActualCountInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.coverLeafCountInput.value='';
	this.coverLeafCountInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.coverPageCountInput.value='';
	this.coverPageCountInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.coverColorCountInput.value='';
	this.coverColorCountInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	this.coverPostApplicationInput.value='';
	this.coverPostApplicationInput.parentNode.MaterialTextfield.boundUpdateClassesHandler();

};

// A loading image URL.
JobOrder.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

JobOrder.prototype.toggleDrawer = function(eventButton) {
	if (this.stocksCardContainer.hasAttribute('hidden') && (eventButton.target.id == 'stocks-drawer')) {
		this.stocksCardContainer.removeAttribute('hidden');
		this.ordersCardContainer.setAttribute('hidden', 'true');

		this.stockDrawer.style.color = "#ff9800";
		this.stockDrawer.style.fontSize = "large";
		this.jobOrderDrawer.style.color = "#757575";
		this.jobOrderDrawer.style.fontSize = "larger";
	} else if (eventButton.target.id == 'job-order-drawer') {
		this.ordersCardContainer.removeAttribute('hidden');
		this.stocksCardContainer.setAttribute('hidden', 'true');

		this.jobOrderDrawer.style.color = "#ff9800";
		this.jobOrderDrawer.style.fontSize = "large";
		this.stockDrawer.style.color = "#757575";
		this.stockDrawer.style.fontSize = "larger";
	}
};

// Checks that the Firebase SDK has been correctly setup and configured.
JobOrder.prototype.checkSetup = function() {
	if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
		window.alert('You have not configured and imported the Firebase SDK. ' +
				'Make sure you go through the setup instructions and make ' +
				'sure you are running the app using `firebase serve`');
	}
};

window.onload = function() {
	window.JobOrder = new JobOrder();
};


