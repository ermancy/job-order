'use strict'

// Initializes JobOrder.
function JobOrder() {
	this.checkSetup()

	this.ORDER_TEMPLATE =
	'<div class="order-container">' +
		'<div class="jobOrderNo"></div>' +
		'<div class="jobOrderDate"></div>' +
		'<div class="customerName"></div>' +
		'<div class="customerRep"></div>' +
		'<div class="orderType"></div>' +
		'<button class="detailButton mdl-button mdl-js-button mdl-button--raised">Detay</button>' +
	'</div>'
	
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
	'</div>'
	
	this.STOCK_USED_TEMPLATE =
	'<div class="stock-used-container" id="stock-used-filler">' +
		'<div class="stockJobOrderNo">Talep No</div>' +
		'<div class="stockJobOrderPaperCount">Kullanılan Tabaka</div>' +
		'<div class="stockConsumePaperNotes">Açıklama</div>' +
	'</div>'
	
	this.LIST_TEMPLATE = '<li class="mdl-menu__item"></li>'

	// Saves order on form submit.
	document.getElementById('order-form').addEventListener('submit', this.saveOrder.bind(this))
	document.getElementById('update-form').addEventListener('submit', this.updateOrder.bind(this))
	
	// Saves stock on form submit.
	document.getElementById('stock-form').addEventListener('submit', this.saveStock.bind(this))

	// Updates stock on form submit.
	document.getElementById('consume-form').addEventListener('submit', this.updateStock.bind(this))

	document.getElementById('sign-out').addEventListener('click', this.signOut.bind(this))
	document.getElementById('sign-in').addEventListener('click', this.signIn.bind(this))

	document.getElementById('job-order-drawer').addEventListener('click', this.toggleDrawer.bind(this))
	document.getElementById('stocks-drawer').addEventListener('click', this.toggleDrawer.bind(this))
	
	document.getElementById('orders-cancel').addEventListener('click', function(){
		document.getElementById('orders-card').removeAttribute('hidden')
		document.getElementById('submit-card').setAttribute('hidden', 'true')
	}.bind(this))

	document.getElementById('update-cancel').addEventListener('click', function(){
		document.getElementById('orders-card').removeAttribute('hidden')
		document.getElementById('update-card').setAttribute('hidden', 'true')
	})
	
	document.getElementById('orders-new').addEventListener('click', function(){
		document.getElementById('orders-card').setAttribute('hidden', 'true')
		document.getElementById('submit-card').removeAttribute('hidden')
	}.bind(this))

	document.getElementById('stocks-new').addEventListener('click', function(){
		document.getElementById('stocks-card').setAttribute('hidden', 'true')
		document.getElementById('stock-in-card').removeAttribute('hidden')
	}.bind(this))

	document.getElementById('stocks-cancel').addEventListener('click', function(){
		document.getElementById('stocks-card').removeAttribute('hidden')
		document.getElementById('stock-in-card').setAttribute('hidden', 'true')
	}.bind(this))

	document.getElementById('consume-cancel').addEventListener('click', function(){
		document.getElementById('stocks-card').removeAttribute('hidden')
		document.getElementById('stock-out-card').setAttribute('hidden', 'true')
		document.getElementById('stock-used-card').setAttribute('hidden', 'true')
		document.getElementById('stock-info-card').setAttribute('hidden', 'true')
	}.bind(this))

	this.initFirebase()
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
JobOrder.prototype.initFirebase = function() {
	// Shortcuts to Firebase SDK features.
	this.auth = firebase.auth()
	this.database = firebase.database()
	this.storage = firebase.storage()

	// Initiates Firebase auth and listen to auth state changes.
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this))
}

// Sets the URL of the given img element with the URL of the image stored in Cloud Storage.
JobOrder.prototype.setImageUrl = function(imageUri, imgElement) {
	
	// If the image is a Cloud Storage URI we fetch the URL.
	if (imageUri.startsWith('gs://')) {
		imgElement.src = JobOrder.LOADING_IMAGE_URL // Display a loading image first.
		this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
			imgElement.src = metadata.downloadURLs[0]
		})
	} else {
		imgElement.src = imageUri
	}

}

// Signs-in Job Order.
JobOrder.prototype.signIn = function() {
	// Sign in Firebase using popup auth and Google as the identity provider.
	var provider = new firebase.auth.EmailAuthProvider()
	this.auth.signInWithEmailAndPassword(document.getElementById('email').value, document.getElementById('password').value)
	document.getElementById('email').value = ''
	document.getElementById('password').value = ''
}

// Signs-out of Job Order.
JobOrder.prototype.signOut = function() {
	// Sign out of Firebase.
	this.auth.signOut()
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
JobOrder.prototype.onAuthStateChanged = function(user) {
	if (user) { // User is signed in!
		var userName = user.email

		// Set the user's profile name.
		document.getElementById('user-name').textContent = userName

		// Show user's profile and sign-out button.
		document.getElementById('user-name').removeAttribute('hidden')
		document.getElementById('sign-out').removeAttribute('hidden')

		// Hide sign-in button.
		document.getElementById('sign-in').setAttribute('hidden', 'true')
		document.getElementById('email-box').setAttribute('hidden', 'true')
		document.getElementById('password-box').setAttribute('hidden', 'true')

		// We load currently existing chant orders.
		this.loadOrders()
		this.loadStocks()

		// We save the Firebase Messaging Device token and enable notifications.
		this.saveMessagingDeviceToken()
	} else { // User is signed out!
		// Hide user's profile and sign-out button.
		document.getElementById('user-name').setAttribute('hidden', 'true')
		//this.userPic.setAttribute('hidden', 'true')
		document.getElementById('sign-out').setAttribute('hidden', 'true')

		// Show sign-in button.
		document.getElementById('sign-in').removeAttribute('hidden')
		document.getElementById('email-box').removeAttribute('hidden')
		document.getElementById('password-box').removeAttribute('hidden')
	}
}

// Returns true if user is signed-in. Otherwise false and displays a message.
JobOrder.prototype.checkSignedInWithMessage = function() {
	// Return true if the user is signed in Firebase
	if (this.auth.currentUser) {
		return true
	}

	// Display a order to the user using a Toast.
	var data = {
		message: 'Önce Giriş Yapmalısın!',
		timeout: 2000
	}
	document.getElementById('must-signin-snackbar').MaterialSnackbar.showSnackbar(data)
	return false
}

// Saves the messaging device token to the datastore.
JobOrder.prototype.saveMessagingDeviceToken = function() {
	firebase.messaging().getToken().then(function(currentToken) {
		if (currentToken) {
			console.log('Got FCM device token:', currentToken)
			// Saving the Device Token to the datastore.
			firebase.database().ref('/fcmTokens').child(currentToken)
					.set(firebase.auth().currentUser.uid)
		} else {
			// Need to request permissions to show notifications.
			this.requestNotificationsPermissions()
		}
	}.bind(this)).catch(function(error){
		console.error('Unable to get messaging token.', error)
	})
}

// Requests permissions to show notifications.
JobOrder.prototype.requestNotificationsPermissions = function() {
	console.log('Requesting notifications permission...')
	firebase.messaging().requestPermission().then(function() {
		// Notification permission granted.
		this.saveMessagingDeviceToken()
	}.bind(this)).catch(function(error) {
		console.error('Unable to get permission to notify.', error)
	})
}

// Resets the given MaterialTextfield.
JobOrder.prototype.resetMaterialTextfield = function() {
	//this.querySelector('.mdl-textfield__input').parentNode.MaterialTextField.boundUpdateClassesHandler()

	document.getElementById('job-order-no').value = ''
	document.getElementById('job-order-no').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('customer-name').value = ''
	document.getElementById('customer-name').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('order-type').value = ''
	document.getElementById('order-type').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('order-size').value = ''
	document.getElementById('order-size').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('job-count').value = ''
	document.getElementById('job-count').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('print-machine').value = ''
	document.getElementById('print-machine').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('plate-type').value = ''
	document.getElementById('plate-type').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('binding').value = ''
	document.getElementById('binding').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('notes').value = ''
	document.getElementById('notes').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('customer-rep').value = ''
	document.getElementById('customer-rep').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('paper-weight').value = ''
	document.getElementById('paper-weight').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('paper-type').value = ''
	document.getElementById('paper-type').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('paper-size').value = ''
	document.getElementById('paper-size').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('print-size').value = ''
	document.getElementById('print-size').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('print-count').value = ''
	document.getElementById('print-count').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('actual-count').value = ''
	document.getElementById('actual-count').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('leaf-count').value = ''
	document.getElementById('leaf-count').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('page-count').value = ''
	document.getElementById('page-count').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('color-count').value = ''
	document.getElementById('color-count').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('post-application').value = ''
	document.getElementById('post-application').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('cover-paper-weight').value = ''
	document.getElementById('cover-paper-weight').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('cover-paper-type').value = ''
	document.getElementById('cover-paper-type').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('cover-paper-size').value = ''
	document.getElementById('cover-paper-size').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('cover-print-size').value = ''
	document.getElementById('cover-print-size').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('cover-print-count').value = ''
	document.getElementById('cover-print-count').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('cover-actual-count').value = ''
	document.getElementById('cover-actual-count').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('cover-leaf-count').value = ''
	document.getElementById('cover-leaf-count').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('cover-page-count').value = ''
	document.getElementById('cover-page-count').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('cover-color-count').value = ''
	document.getElementById('cover-color-count').parentNode.MaterialTextfield.boundUpdateClassesHandler()
	document.getElementById('cover-post-application').value = ''
	document.getElementById('cover-post-application').parentNode.MaterialTextfield.boundUpdateClassesHandler()
}

// A loading image URL.
JobOrder.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif'

JobOrder.prototype.toggleDrawer = function(eventButton) {
	if (document.getElementById('stocks-card-container').hasAttribute('hidden') && (eventButton.target.id == 'stocks-drawer')) {
		document.getElementById('stocks-card-container').removeAttribute('hidden')
		document.getElementById('orders-card-container').setAttribute('hidden', 'true')

		document.getElementById('stocks-drawer').style.color = "#ff9800"
		document.getElementById('stocks-drawer').style.fontSize = "large"
		document.getElementById('job-order-drawer').style.color = "#757575"
		document.getElementById('job-order-drawer').style.fontSize = "larger"
	} else if (eventButton.target.id == 'job-order-drawer') {
		document.getElementById('orders-card-container').removeAttribute('hidden')
		document.getElementById('stocks-card-container').setAttribute('hidden', 'true')

		document.getElementById('job-order-drawer').style.color = "#ff9800"
		document.getElementById('job-order-drawer').style.fontSize = "large"
		document.getElementById('stocks-drawer').style.color = "#757575"
		document.getElementById('stocks-drawer').style.fontSize = "larger"
	}
}

// Checks that the Firebase SDK has been correctly setup and configured.
JobOrder.prototype.checkSetup = function() {
	if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
		window.alert('You have not configured and imported the Firebase SDK. ' +
				'Make sure you go through the setup instructions and make ' +
				'sure you are running the app using `firebase serve`')
	}
}

window.onload = function() {
	window.JobOrder = new JobOrder()
}


