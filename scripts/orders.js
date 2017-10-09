// Loads orders history and listens for upcoming ones.
JobOrder.prototype.loadOrders = function() {
	// Reference to the /orders/ database path.
	this.ordersRef = this.database.ref('orders');
	// Make sure we remove all previous listeners.
	this.ordersRef.off();

	// Loads the last 12 orders and listen for new ones.
	var setOrder = function(data) {
		var val = data.val();
		this.displayOrder(data.key, val.jobOrderDate, val.jobOrderNo, val.customerName, val.orderType, val.customerRep);
	}.bind(this);
	this.ordersRef.orderByChild('jobOrderDateDesc').limitToLast(12).on('child_added', setOrder);
	this.ordersRef.orderByChild('jobOrderDateDesc').limitToLast(12).on('child_changed', setOrder);
};

// Saves a new order on the Firebase DB.
JobOrder.prototype.saveOrder = function(e) {
	e.preventDefault();
	// Check that the user entered a order and is signed in.
	if (this.jobOrderNoInput.value && this.checkSignedInWithMessage()) {

		var currentUser = this.auth.currentUser;
		
		var dateNow = Date.now();
		var date2100 = new Date(2100, 0, 1);

		var dateDesc = new Date();
		dateDesc = date2100.getTime() - dateNow;
		
		console.log(date2100.getTime() + ' - ' + dateDesc  + ' - orders');

		// Add a new order entry to the Firebase Database.
		this.ordersRef.push({
			owner: currentUser.email,
			jobOrderDate : Date.now(),
			jobOrderDateDesc : dateDesc,
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
			this.resetMaterialTextfield();
			this.toggleButton();
		}.bind(this)).catch(function(error) {
			console.error('Error writing new order to Firebase Database', error);
		});
	}
};

// Displays a Order in the UI.
JobOrder.prototype.displayOrder = function(key, jobOrderDate, jobOrderNo, customerName, orderType, customerRep) {
	var div = document.getElementById(key);
	// If an element for that order does not exists yet we create it.
	if (!div) {
		var container = document.createElement('div');
		container.innerHTML = JobOrder.ORDER_TEMPLATE;
		div = container.firstChild;
		div.setAttribute('id', key);
		this.orderList.appendChild(div);
	}

	var dateFormatted = new Date(jobOrderDate);

	div.querySelector('.jobOrderDate').textContent = dateFormatted.toLocaleString();
	div.querySelector('.jobOrderNo').textContent = jobOrderNo;
	div.querySelector('.customerName').textContent = customerName;
	div.querySelector('.customerRep').textContent = customerRep;
	div.querySelector('.orderType').textContent = orderType;

	//Click events
	div.querySelector('.detailButton').addEventListener('click', function() {
		console.log('clicked ' + key);
	});
	
	// Show the card fading-in.
//	setTimeout(function() {div.classList.add('visible')}, 1);
	this.orderList.scrollTop = this.orderList.scrollHeight;
	this.jobOrderNoInput.focus();
};

JobOrder.prototype.updateOrder = function(key) {
	var updates = {};
	updates['/orders/' + key] = {
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
	};
	
	this.ordersRef.update(updates).then(function() {
		// Clear order text field and SEND button state.
		this.resetMaterialTextfield();
	}.bind(this)).catch(function(error) {
		console.error('Error writing new order to Firebase Database', error);
	});
	
};

// Enables or disables the submit button depending on the values of the input
// fields.
JobOrder.prototype.toggleButton = function() {
	if (this.jobOrderNoInput.value) {
		this.submitButton.removeAttribute('disabled');
	} else {
		this.submitButton.setAttribute('disabled', 'true');
	}
};