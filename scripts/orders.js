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
//	div.querySelector('.detailButton').addEventListener('click', function() {
//		console.log('clicked ' + key);
//	});
	
	div.querySelector('.detailButton').addEventListener('click', function() {
		console.log('clicked ' + key);
		var query = firebase.database().ref('orders/' + key);
	
		query.once('value').then(function(snap){
			var data = snap.val();

			var jobOrderDateString = new Date(data.jobOrderDate);
						
			document.getElementById('order-key').value = key;
			document.getElementById('job-order-date-update-div').MaterialTextfield.change(jobOrderDateString.toLocaleString());
			
			document.getElementById('job-order-no-update-div').MaterialTextfield.change(data.jobOrderNo); 			
			document.getElementById('customer-name-update-div').MaterialTextfield.change(data.customerName); 			
			document.getElementById('order-type-update-div').MaterialTextfield.change(data.orderType); 				
			document.getElementById('order-size-update-div').MaterialTextfield.change(data.orderSize); 				
			document.getElementById('job-count-update-div').MaterialTextfield.change(data.jobCount); 				
			document.getElementById('print-machine-update-div').MaterialTextfield.change(data.printMachine); 			
			document.getElementById('plate-type-update-div').MaterialTextfield.change(data.plateType); 				
			document.getElementById('binding-update-div').MaterialTextfield.change(data.binding); 				
			document.getElementById('notes-update-div').MaterialTextfield.change(data.notes); 					
			document.getElementById('customer-rep-update-div').MaterialTextfield.change(data.customerRep); 			
			document.getElementById('paper-weight-update-div').MaterialTextfield.change(data.paperWeight); 			
			document.getElementById('paper-type-update-div').MaterialTextfield.change(data.paperType); 				
			document.getElementById('paper-size-update-div').MaterialTextfield.change(data.paperSize); 				
			document.getElementById('print-size-update-div').MaterialTextfield.change(data.printSize); 				
			document.getElementById('print-count-update-div').MaterialTextfield.change(data.printCount); 			
			document.getElementById('actual-count-update-div').MaterialTextfield.change(data.actualCount); 			
			document.getElementById('leaf-count-update-div').MaterialTextfield.change(data.leafCount); 				
			document.getElementById('page-count-update-div').MaterialTextfield.change(data.pageCount); 				
			document.getElementById('color-count-update-div').MaterialTextfield.change(data.colorCount); 			
			document.getElementById('post-application-update-div').MaterialTextfield.change(data.postApplication); 		
			document.getElementById('cover-paper-weight-update-div').MaterialTextfield.change(data.coverPaperWeight); 		
			document.getElementById('cover-paper-type-update-div').MaterialTextfield.change(data.coverPaperType); 		
			document.getElementById('cover-paper-size-update-div').MaterialTextfield.change(data.coverPaperSize); 		
			document.getElementById('cover-print-size-update-div').MaterialTextfield.change(data.coverPrintSize); 		
			document.getElementById('cover-print-count-update-div').MaterialTextfield.change(data.coverPrintCount); 		
			document.getElementById('cover-actual-count-update-div').MaterialTextfield.change(data.coverActualCount); 		
			document.getElementById('cover-leaf-count-update-div').MaterialTextfield.change(data.coverLeafCount); 		
			document.getElementById('cover-page-count-update-div').MaterialTextfield.change(data.coverPageCount); 		
			document.getElementById('cover-color-count-update-div').MaterialTextfield.change(data.coverColorCount); 		
			document.getElementById('cover-post-application-update-div').MaterialTextfield.change(data.coverPostApplication); 	
			
			
		});
	
		document.getElementById('tab1-panel').classList.remove("is-active");
		document.getElementById('tab3-panel').classList.add("is-active");

		document.getElementById('tab1-button').classList.remove("is-active");
		document.getElementById('tab3-button').classList.add("is-active");
		
		document.getElementById('update-button').removeAttribute('disabled');
		document.getElementById('update-clear').removeAttribute('disabled');
	});
	
	var listElement = document.getElementById('option-' + key);
	// If an element for that stock does not exists yet we create it.
	if (!listElement) {
		var listElement = document.createElement('li');
		listElement.classList.add('mdl-menu__item');
//		listElement.innerHTML = JobOrder.LIST_TEMPLATE;
		listElement.textContent = jobOrderNo;
		listElement.setAttribute('id', 'option-' + key);
		listElement.setAttribute('data-val', jobOrderNo);
		listElement.setAttribute('tabIndex', '-1');
		document.getElementById('consume-job-order-no-list').appendChild(listElement);
	}
//	document.getElementById('consume-job-order-no').value = document.getElementById('consume-job-order-no-list').firstChild.value;
	
	// Show the card fading-in.
//	setTimeout(function() {div.classList.add('visible')}, 1);
	this.orderList.scrollTop = this.orderList.scrollHeight;
	this.jobOrderNoInput.focus();
};

JobOrder.prototype.updateOrder = function() {
	const key = document.getElementById('order-key').value;
	const orderToUpdate = this.database.ref("orders/" + key);
	var updates = {
		jobOrderNo: this.jobOrderNoUpdateInput.value,
		customerName: this.customerNameUpdateInput.value,
		orderType: this.orderTypeUpdateInput.value,
		orderSize: this.orderSizeUpdateInput.value,
		jobCount: this.jobCountUpdateInput.value,
		printMachine: this.printMachineUpdateInput.value,
		plateType: this.plateTypeUpdateInput.value,
		binding: this.bindingUpdateInput.value,
		notes: this.notesUpdateInput.value,
		customerRep: this.customerRepUpdateInput.value,
		paperWeight: this.paperWeightUpdateInput.value,
		paperType: this.paperTypeUpdateInput.value,
		paperSize: this.paperSizeUpdateInput.value,
		printSize: this.printSizeUpdateInput.value,
		printCount: this.printCountUpdateInput.value,
		actualCount: this.actualCountUpdateInput.value,
		leafCount: this.leafCountUpdateInput.value,
		pageCount: this.pageCountUpdateInput.value,
		colorCount: this.colorCountUpdateInput.value,
		postApplication: this.postApplicationUpdateInput.value,
		coverPaperWeight: this.coverPaperWeightUpdateInput.value,
		coverPaperType: this.coverPaperTypeUpdateInput.value,
		coverPaperSize: this.coverPaperSizeUpdateInput.value,
		coverPrintSize: this.coverPrintSizeUpdateInput.value,
		coverPrintCount: this.coverPrintCountUpdateInput.value,
		coverActualCount: this.coverActualCountUpdateInput.value,
		coverLeafCount: this.coverLeafCountUpdateInput.value,
		coverPageCount: this.coverPageCountUpdateInput.value,
		coverColorCount: this.coverColorCountUpdateInput.value,
		coverPostApplication: this.coverPostApplicationUpdateInput.value
	};
	
	orderToUpdate.update(updates).then(function() {
		// Clear order text field and SEND button state.
//		this.resetMaterialTextfield();
//		document.getElementsByClassName('mdl-textfield input').value = '';
//		document.getElementsByClassName('mdl-textfield__input').parentNode.MaterialTextfield.boundUpdateClassesHandler();
		
		document.getElementById('tab1-panel').classList.add("is-active");
		document.getElementById('tab1-button').classList.add("is-active");
		
		document.getElementById('tab3-panel').classList.remove("is-active");
		document.getElementById('tab3-button').classList.remove("is-active");
		
		document.getElementById('update-button').setAttribute('disabled', 'true');
		document.getElementById('update-clear').setAttribute('disabled', 'true');
	}).catch(function(error) {console.error('Error:', error)});
};

// Enables or disables the submit button depending on the values of the input
// fields.
JobOrder.prototype.toggleButton = function() {
	if (this.jobOrderNoInput.value) {
		this.submitButton.removeAttribute('disabled');
		this.clearButton.removeAttribute('disabled');
	} else {
		this.submitButton.setAttribute('disabled', 'true');
		this.clearButton.setAttribute('disabled', 'true');
	}
};