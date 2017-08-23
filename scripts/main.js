'use strict';

// Initializes JobOrder.
function JobOrder() {
	this.checkSetup();

	// Shortcuts to DOM Elements.
	this.updateForm = document.getElementById('update-form');
	this.orderForm = document.getElementById('order-form');
	this.orderList = document.getElementById('orders');

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

	this.submitButton = document.getElementById('submit');
	this.submitImageButton = document.getElementById('submitImage');
	this.imageForm = document.getElementById('image-form');
	this.mediaCapture = document.getElementById('mediaCapture');
	this.userPic = document.getElementById('user-pic');
	this.userName = document.getElementById('user-name');
	this.email = document.getElementById('email');
	this.password = document.getElementById('password');
	this.emailBox = document.getElementById('email-box');
	this.passwordBox = document.getElementById('password-box');
	this.signInButton = document.getElementById('sign-in');
	this.signOutButton = document.getElementById('sign-out');
	this.signInSnackbar = document.getElementById('must-signin-snackbar');

	this.tab1Panel = document.getElementById('tab1-panel');
	this.tab2Panel = document.getElementById('tab2-panel');

	this.ORDER_TEMPLATE =
	'<div class="order-container">' +
		'<div class="jobOrderNo"></div>' +
		'<div class="customerName"></div>' +
		'<div class="orderType"></div>' +
		'<button class="detailButton mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised">Detay</button>' +
	'</div>';

		// Saves order on form submit.
	this.orderForm.addEventListener('submit', this.saveOrder.bind(this));

	this.signOutButton.addEventListener('click', this.signOut.bind(this));
	this.signInButton.addEventListener('click', this.signIn.bind(this));

	// Toggle for the button.
	var buttonTogglingHandler = this.toggleButton.bind(this);
	this.jobOrderNoInput.addEventListener('keyup', buttonTogglingHandler);
	this.jobOrderNoInput.addEventListener('change', buttonTogglingHandler);

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

// Loads orders history and listens for upcoming ones.
JobOrder.prototype.loadOrders = function() {
	// Reference to the /orders/ database path.
	this.ordersRef = this.database.ref('orders');
	// Make sure we remove all previous listeners.
	this.ordersRef.off();

	// Loads the last 12 orders and listen for new ones.
	var setOrder = function(data) {
		var val = data.val();
		this.displayOrder(data.key, val.jobOrderNo, val.customerName, val.orderType);
	}.bind(this);
//	this.ordersRef.limitToLast(12).on('child_added', setOrder);
//	this.ordersRef.limitToLast(12).on('child_changed', setOrder);
	this.ordersRef.on('child_added', setOrder);
	this.ordersRef.on('child_changed', setOrder);
};

// Saves a new order on the Firebase DB.
JobOrder.prototype.saveOrder = function(e) {
	e.preventDefault();
	// Check that the user entered a order and is signed in.
	if (this.jobOrderNoInput.value && this.checkSignedInWithMessage()) {

		var currentUser = this.auth.currentUser;
		// Add a new order entry to the Firebase Database.
		this.ordersRef.push({
			owner: currentUser.email,
			jobOrderNo: this.jobOrderNoInput.value,
			customerName: this.customerNameInput.value,
			orderType: this.orderTypeInput.value,
			orderSize: this.orderSizeInput.value,
			jobCount: this.jobCountInput.value,
			printMachine: this.printMachineInput.value,
			plateType: this.plateTypeInput.value,
			binding: this.bindingInput.value,
			notes: this.notesInput.value,
			customerRep: this.customerRepInput.value,
			paperWeight: this.paperWeightInput.value,
			paperType: this.paperTypeInput.value,
			paperSize: this.paperSizeInput.value,
			printSize: this.printSizeInput.value,
			printCount: this.printCountInput.value,
			actualCount: this.actualCountInput.value,
			leafCount: this.leafCountInput.value,
			pageCount: this.pageCountInput.value,
			colorCount: this.colorCountInput.value,
			postApplication: this.postApplicationInput.value,
			coverPaperWeight: this.coverPaperWeightInput.value,
			coverPaperType: this.coverPaperTypeInput.value,
			coverPaperSize: this.coverPaperSizeInput.value,
			coverPrintSize: this.coverPrintSizeInput.value,
			coverPrintCount: this.coverPrintCountInput.value,
			coverActualCount: this.coverActualCountInput.value,
			coverLeafCount: this.coverLeafCountInput.value,
			coverPageCount: this.coverPageCountInput.value,
			coverColorCount: this.coverColorCountInput.value,
			coverPostApplication: this.coverPostApplicationInput.value
		}).then(function() {
			// Clear order text field and SEND button state.
			this.resetMaterialTextFields();
			this.toggleButton();
		}.bind(this)).catch(function(error) {
			console.error('Error writing new order to Firebase Database', error);
		});
	}
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

// Resets the given MaterialTextField.
JobOrder.prototype.resetMaterialTextFields = function() {
	//this.querySelector('.mdl-textfield__input').parentNode.MaterialTextField.boundUpdateClassesHandler();

	this.jobOrderNoInput.value ='';
	this.customerNameInput.value='';
	this.orderTypeInput.value='';
	this.orderSizeInput.value='';
	this.jobCountInput.value='';
	this.printMachineInput.value='';
	this.plateTypeInput.value='';
	this.bindingInput.value='';
	this.notesInput.value='';
	this.customerRepInput.value='';
	this.paperWeightInput.value='';
	this.paperTypeInput.value='';
	this.paperSizeInput.value='';
	this.printSizeInput.value='';
	this.printCountInput.value='';
	this.actualCountInput.value='';
	this.leafCountInput.value='';
	this.pageCountInput.value='';
	this.colorCountInput.value='';
	this.postApplicationInput.value='';
	this.coverPaperWeightInput.value='';
	this.coverPaperTypeInput.value='';
	this.coverPaperSizeInput.value='';
	this.coverPrintSizeInput.value='';
	this.coverPrintCountInput.value='';
	this.coverActualCountInput.value='';
	this.coverLeafCountInput.value='';
	this.coverPageCountInput.value='';
	this.coverColorCountInput.value='';
	this.coverPostApplicationInput.value='';
};

// A loading image URL.
JobOrder.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';



// Displays a Order in the UI.
JobOrder.prototype.displayOrder = function(key, jobOrderNo, customerName, orderType) {
	var div = document.getElementById(key);
	// If an element for that order does not exists yet we create it.
	if (!div) {
		var container = document.createElement('div');
		container.innerHTML = JobOrder.ORDER_TEMPLATE;
		div = container.firstChild;
		div.setAttribute('id', key);
		this.orderList.appendChild(div);
	}

	div.querySelector('.jobOrderNo').textContent = jobOrderNo;
	div.querySelector('.customerName').textContent = customerName;
	div.querySelector('.orderType').textContent = orderType;

	//Click events
	div.querySelector('.detailButton').addEventListener('click', function () {
		console.log('clicked ' + key);
	});
	
	// Show the card fading-in.
	setTimeout(function() {div.classList.add('visible')}, 1);
	this.orderList.scrollTop = this.orderList.scrollHeight;
	this.jobOrderNoInput.focus();
};

JobOrder.prototype.detailOrder = function(key) {

}

// Enables or disables the submit button depending on the values of the input
// fields.
JobOrder.prototype.toggleButton = function() {
	if (this.jobOrderNoInput.value) {
		this.submitButton.removeAttribute('disabled');
	} else {
		this.submitButton.setAttribute('disabled', 'true');
	}
};

JobOrder.prototype.toggleTabs = function() {
	if (this.jobOrderNoInput.value) {
		this.submitButton.removeAttribute('disabled');
	} else {
		this.submitButton.setAttribute('disabled', 'true');
	}
};

// Checks that the Firebase SDK has been correctly setup and configured.
JobOrder.prototype.checkSetup = function() {
	if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
		window.alert('You have not configured and imported the Firebase SDK. ' +
				'Make sure you go through the codelab setup instructions and make ' +
				'sure you are running the codelab using `firebase serve`');
	}
};

window.onload = function() {
	window.JobOrder = new JobOrder();
};
