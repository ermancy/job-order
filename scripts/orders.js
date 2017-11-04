// Loads orders history and listens for upcoming ones.
JobOrder.prototype.loadOrders = function() {
	// Reference to the /orders/ database path.
	this.ordersRef = this.database.ref('orders')
	// Make sure we remove all previous listeners.
	this.ordersRef.off()

	// Loads the last 12 orders and listen for new ones.
	var setOrder = function(data) {
		var val = data.val()
		this.displayOrder(data.key, val.jobOrderDate, val.jobOrderNo, val.customerName, val.orderType, val.customerRep)
	}.bind(this)
	this.ordersRef.orderByChild('jobOrderDateDesc').limitToLast(12).on('child_added', setOrder)
	this.ordersRef.orderByChild('jobOrderDateDesc').limitToLast(12).on('child_changed', setOrder)
}

// Saves a new order on the Firebase DB.
JobOrder.prototype.saveOrder = function(e) {
	e.preventDefault()
	// Check that the user entered a order and is signed in.
	if (document.getElementById('job-order-no').value && this.checkSignedInWithMessage()) {

		var currentUser = this.auth.currentUser
		
		var dateNow = Date.now()
		var date2100 = new Date(2100, 0, 1)

		var dateDesc = new Date()
		dateDesc = date2100.getTime() - dateNow
		
		console.log(date2100.getTime() + ' - ' + dateDesc  + ' - orders')

		// Add a new order entry to the Firebase Database.
		this.ordersRef.push({
			owner: currentUser.email,
			jobOrderDate : Date.now(),
			jobOrderDateDesc : dateDesc,
			jobOrderNo:document.getElementById('job-order-no').value,
			customerName:document.getElementById('customer-name').value,
			orderType:document.getElementById('order-type').value,
			orderSize:document.getElementById('order-size').value,
			jobCount:document.getElementById('job-count').value,
			printMachine:document.getElementById('print-machine').value,
			plateType:document.getElementById('plate-type').value,
			binding:document.getElementById('binding').value,
			notes:document.getElementById('notes').value,
			customerRep:document.getElementById('customer-rep').value,
			paperWeight:document.getElementById('paper-weight').value,
			paperType:document.getElementById('paper-type').value,
			paperSize:document.getElementById('paper-size').value,
			printSize:document.getElementById('print-size').value,
			printCount:document.getElementById('print-count').value,
			actualCount:document.getElementById('actual-count').value,
			leafCount:document.getElementById('leaf-count').value,
			pageCount:document.getElementById('page-count').value,
			colorCount:document.getElementById('color-count').value,
			postApplication:document.getElementById('post-application').value,
			coverPaperWeight:document.getElementById('cover-paper-weight').value,
			coverPaperType:document.getElementById('cover-paper-type').value,
			coverPaperSize:document.getElementById('cover-paper-size').value,
			coverPrintSize:document.getElementById('cover-print-size').value,
			coverPrintCount:document.getElementById('cover-print-count').value,
			coverActualCount:document.getElementById('cover-actual-count').value,
			coverLeafCount:document.getElementById('cover-leaf-count').value,
			coverPageCount:document.getElementById('cover-page-count').value,
			coverColorCount:document.getElementById('cover-color-count').value,
			coverPostApplication:document.getElementById('cover-post-application').value
		}).then(function() {
			// Clear order text field and SEND button state.
			this.resetMaterialTextfield()
			document.getElementById('orders-card').removeAttribute('hidden')
			document.getElementById('submit-card').setAttribute('hidden', 'true')
		}.bind(this)).catch(function(error) {
			console.error('Error writing new order to Firebase Database', error)
		})
	}
}

// Displays a Order in the UI.
JobOrder.prototype.displayOrder = function(key, jobOrderDate, jobOrderNo, customerName, orderType, customerRep) {
	var div = document.getElementById(key)
	// If an element for that order does not exists yet we create it.
	if (!div) {
		var container = document.createElement('div')
		container.innerHTML = JobOrder.ORDER_TEMPLATE
		div = container.firstChild
		div.setAttribute('id', key)
		document.getElementById('orders').appendChild(div)
	}

	var dateFormatted = new Date(jobOrderDate)

	div.querySelector('.jobOrderDate').textContent = dateFormatted.toLocaleString()
	div.querySelector('.jobOrderNo').textContent = jobOrderNo
	div.querySelector('.customerName').textContent = customerName
	div.querySelector('.customerRep').textContent = customerRep
	div.querySelector('.orderType').textContent = orderType

	//Click events
//	div.querySelector('.detailButton').addEventListener('click', function() {
//		console.log('clicked ' + key)
//	})
	
	div.querySelector('.detailButton').addEventListener('click', function() {
		console.log('clicked ' + key)
		var query = firebase.database().ref('orders/' + key)
	
		query.once('value').then(function(snap){
			var data = snap.val()

			var jobOrderDateString = new Date(data.jobOrderDate)
						
			document.getElementById('order-key').value = key
			document.getElementById('job-order-date-update-div').MaterialTextfield.change(jobOrderDateString.toLocaleString())
			
			document.getElementById('job-order-no-update-div').MaterialTextfield.change(data.jobOrderNo) 			
			document.getElementById('customer-name-update-div').MaterialTextfield.change(data.customerName) 			
			document.getElementById('order-type-update-div').MaterialTextfield.change(data.orderType) 				
			document.getElementById('order-size-update-div').MaterialTextfield.change(data.orderSize) 				
			document.getElementById('job-count-update-div').MaterialTextfield.change(data.jobCount) 				
			document.getElementById('print-machine-update-div').MaterialTextfield.change(data.printMachine) 			
			document.getElementById('plate-type-update-div').MaterialTextfield.change(data.plateType) 				
			document.getElementById('binding-update-div').MaterialTextfield.change(data.binding) 				
			document.getElementById('notes-update-div').MaterialTextfield.change(data.notes) 					
			document.getElementById('customer-rep-update-div').MaterialTextfield.change(data.customerRep) 			
			document.getElementById('paper-weight-update-div').MaterialTextfield.change(data.paperWeight) 			
			document.getElementById('paper-type-update-div').MaterialTextfield.change(data.paperType) 				
			document.getElementById('paper-size-update-div').MaterialTextfield.change(data.paperSize) 				
			document.getElementById('print-size-update-div').MaterialTextfield.change(data.printSize) 				
			document.getElementById('print-count-update-div').MaterialTextfield.change(data.printCount) 			
			document.getElementById('actual-count-update-div').MaterialTextfield.change(data.actualCount) 			
			document.getElementById('leaf-count-update-div').MaterialTextfield.change(data.leafCount) 				
			document.getElementById('page-count-update-div').MaterialTextfield.change(data.pageCount) 				
			document.getElementById('color-count-update-div').MaterialTextfield.change(data.colorCount) 			
			document.getElementById('post-application-update-div').MaterialTextfield.change(data.postApplication) 		
			document.getElementById('cover-paper-weight-update-div').MaterialTextfield.change(data.coverPaperWeight) 		
			document.getElementById('cover-paper-type-update-div').MaterialTextfield.change(data.coverPaperType) 		
			document.getElementById('cover-paper-size-update-div').MaterialTextfield.change(data.coverPaperSize) 		
			document.getElementById('cover-print-size-update-div').MaterialTextfield.change(data.coverPrintSize) 		
			document.getElementById('cover-print-count-update-div').MaterialTextfield.change(data.coverPrintCount) 		
			document.getElementById('cover-actual-count-update-div').MaterialTextfield.change(data.coverActualCount) 		
			document.getElementById('cover-leaf-count-update-div').MaterialTextfield.change(data.coverLeafCount) 		
			document.getElementById('cover-page-count-update-div').MaterialTextfield.change(data.coverPageCount) 		
			document.getElementById('cover-color-count-update-div').MaterialTextfield.change(data.coverColorCount) 		
			document.getElementById('cover-post-application-update-div').MaterialTextfield.change(data.coverPostApplication)
		})
	
		document.getElementById('orders-card').setAttribute('hidden', 'true')
		document.getElementById('update-card').removeAttribute('hidden')
	})
	
	var listElement = document.getElementById('option-' + key)
	// If an element for that stock does not exists yet we create it.
	if (!listElement) {
		var listElement = document.createElement('li')
		listElement.classList.add('mdl-menu__item')
//		listElement.innerHTML = JobOrder.LIST_TEMPLATE
		listElement.textContent = jobOrderNo
		listElement.setAttribute('id', 'option-' + key)
		listElement.setAttribute('data-val', jobOrderNo)
		listElement.setAttribute('tabIndex', '-1')
		document.getElementById('consume-job-order-no-list').appendChild(listElement)
	}
	
	getmdlSelect.init(".getmdl-select")
//	document.getElementById('consume-job-order-no').value = document.getElementById('consume-job-order-no-list').firstChild.value
	
	// Show the card fading-in.
//	setTimeout(function() {div.classList.add('visible')}, 1)
	document.getElementById('orders').scrollTop = document.getElementById('orders').scrollHeight
	document.getElementById('job-order-no').focus()
}

JobOrder.prototype.updateOrder = function() {
	const key = document.getElementById('order-key').value
	const orderToUpdate = this.database.ref("orders/" + key)
	var updates = {
		jobOrderNo:document.getElementById('job-order-no-update').value,
		customerName:document.getElementById('customer-name-update').value,
		orderType:document.getElementById('order-type-update').value,
		orderSize:document.getElementById('order-size-update').value,
		jobCount:document.getElementById('job-count-update').value,
		printMachine:document.getElementById('print-machine-update').value,
		plateType:document.getElementById('plate-type-update').value,
		binding:document.getElementById('binding-update').value,
		notes:document.getElementById('notes-update').value,
		customerRep:document.getElementById('customer-rep-update').value,
		paperWeight:document.getElementById('paper-weight-update').value,
		paperType:document.getElementById('paper-type-update').value,
		paperSize:document.getElementById('paper-size-update').value,
		printSize:document.getElementById('print-size-update').value,
		printCount:document.getElementById('print-count-update').value,
		actualCount:document.getElementById('actual-count-update').value,
		leafCount:document.getElementById('leaf-count-update').value,
		pageCount:document.getElementById('page-count-update').value,
		colorCount:document.getElementById('color-count-update').value,
		postApplication:document.getElementById('post-application-update').value,
		coverPaperWeight:document.getElementById('cover-paper-weight-update').value,
		coverPaperType:document.getElementById('cover-paper-type-update').value,
		coverPaperSize:document.getElementById('cover-paper-size-update').value,
		coverPrintSize:document.getElementById('cover-print-size-update').value,
		coverPrintCount:document.getElementById('cover-print-count-update').value,
		coverActualCount:document.getElementById('cover-actual-count-update').value,
		coverLeafCount:document.getElementById('cover-leaf-count-update').value,
		coverPageCount:document.getElementById('cover-page-count-update').value,
		coverColorCount:document.getElementById('cover-color-count-update').value,
		coverPostApplication:document.getElementById('cover-post-application-update').value
	}
	
	orderToUpdate.update(updates).then(function() {
		// Clear order text field and SEND button state.
//		this.resetMaterialTextfield()
//		document.getElementsByClassName('mdl-textfield input').value = ''
//		document.getElementsByClassName('mdl-textfield__input').parentNode.MaterialTextfield.boundUpdateClassesHandler()
		
		document.getElementById('orders-card').setAttribute('hidden', 'true')
		document.getElementById('update-card').removeAttribute('hidden')
	}).catch(function(error) {console.error('Error:', error)})
}
