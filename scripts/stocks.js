JobOrder.prototype.loadStocks = function() {
	// Reference to the /stocks/ database path.
	this.stocksRef = this.database.ref('stocks');
	// Make sure we remove all previous listeners.
	this.stocksRef.off();

	// Loads the last 12 stocks and listen for new ones.
	var setStock = function(data) {
		var val = data.val();
		this.displayStock(data.key, val.stockNo, val.stockDate, val.stockDateDesc, val.stockJobOrderNo, val.stockPaperType, val.stockPaperCount, val.stockPaperWeight, val.stockPaperSize, val.stockPaperUnitPrice);
	}.bind(this);
	
	this.stocksRef.orderByChild('stockDateDesc').limitToLast(12).on('child_added', setStock);
	this.stocksRef.orderByChild('stockDateDesc').limitToLast(12).on('child_changed', setStock);
};

// Saves a new stock on the Firebase DB.
JobOrder.prototype.saveStock = function(e) {
	e.preventDefault();
	// Check that the user entered a order and is signed in.
	if (this.stockNoInput.value && this.checkSignedInWithMessage()) {

		var currentUser = this.auth.currentUser;
		
		var dateNow = Date.now();
		var date2100 = new Date(2100, 0, 1);

		var dateDesc = new Date();
		dateDesc = date2100.getTime() - dateNow;
		
		console.log(date2100.getTime() + ' - ' + dateDesc  + ' - stocks');

		// Add a new order entry to the Firebase Database.
		this.stocksRef.push({
			owner: currentUser.email,
			stockDate : Date.now(),
			stockDateDesc : dateDesc,
			stockNo: this.stockNoInput.value,
			stockPaperType: this.stockPaperTypeInput.value,
			stockPaperCount: this.stockPaperCountInput.value,
			stockPaperWeight: this.stockPaperWeightInput.value,
			stockPaperSize: this.stockPaperSizeInput.value,
			stockPaperUnitPrice: this.stockPaperUnitPriceInput.value
		}).then(function() {
			// Clear order text field and SEND button state.
			this.resetMaterialTextfield();
			this.toggleButton();
		}.bind(this)).catch(function(error) {
			console.error('Error writing new order to Firebase Database', error);
		});
	}
};

JobOrder.prototype.displayStock = function(key, stockNo, stockDate, stockDateDesc, stockJobOrderNo, stockPaperType, stockPaperCount, stockPaperWeight, stockPaperSize, stockPaperUnitPrice) {
	var div = document.getElementById(key);
	// If an element for that stock does not exists yet we create it.
	if (!div) {
		var container = document.createElement('div');
		container.innerHTML = JobOrder.STOCK_TEMPLATE;
		div = container.firstChild;
		div.setAttribute('id', key);
		this.stockList.appendChild(div);
	}

	var dateFormatted = new Date(stockDate);
	
	div.querySelector('.stockNo').textContent = stockNo;
	div.querySelector('.stockDate').textContent = dateFormatted.toLocaleString();
	div.querySelector('.stockPaperType').textContent = stockPaperType;
	div.querySelector('.stockPaperCount').textContent = stockPaperCount;
	div.querySelector('.stockPaperWeight').textContent = stockPaperWeight;
	div.querySelector('.stockPaperSize').textContent = stockPaperSize;
	div.querySelector('.stockPaperUnitPrice').textContent = stockPaperUnitPrice;

	//Click events
	//div.querySelector('.consumeButton').addEventListener('click', function () {
	//	console.log('consumed ' + key);
	//});
	div.querySelector('.consumeButton').addEventListener('click', function() {
		console.log('consumed ' + key);
		var query = firebase.database().ref('stocks/' + key);
	
		query.once('value').then(function(snap){
			var data = snap.val();

			var stockDateString = new Date(data.stockDate);

			document.getElementById('stock-key').value = key;
			document.getElementById('consume-date-div').MaterialTextfield.change(stockDateString.toLocaleString());
			document.getElementById('consume-paper-type-div').MaterialTextfield.change(data.stockPaperType);
			document.getElementById('consume-paper-count-div').MaterialTextfield.change(data.stockPaperCount);
			document.getElementById('consume-paper-weight-div').MaterialTextfield.change(data.stockPaperWeight);
			document.getElementById('consume-paper-size-div').MaterialTextfield.change(data.stockPaperSize);
			document.getElementById('consume-paper-unit-price-div').MaterialTextfield.change(data.stockPaperUnitPrice);
		});
	
		document.getElementById('stock-tab1-panel').classList.remove("is-active");
		document.getElementById('stock-tab3-panel').classList.add("is-active");

		document.getElementById('stock-tab1-button').classList.remove("is-active");
		document.getElementById('stock-tab3-button').classList.add("is-active");
	});
	
	// Show the card fading-in.
	setTimeout(function() {div.classList.add('visible')}, 1);
	this.stockList.scrollTop = this.stockList.scrollHeight;
	this.stockNoInput.focus();
};

JobOrder.prototype.updateStock = function() {
	var key = document.getElementById('stock-key').value;
	var updates = {};
//	updates[key] = {
//		stockJobOrderPaperCount: document.getElementById('consume-paper-count').value,
//		stockJobOrderNo: document.getElementById('consume-job-order-no').value
//	};
	
//	this.stocksRef.update(updates).then(function() {
//		// Clear order text field and SEND button state.
//		//this.resetMaterialTextfield();
//	}.bind(this)).catch(function(error) {
//		console.error('Error writing new order to Firebase Database', error);
//	});

	var stockKey = this.database.ref("stocks/" + key).child("stocksUsed").push().key;
	var stockCount; 
	this.database.ref("stocks/" + key).child("stocksUsedCount").once('value').then(function(snap){
		console.log("snap.val() ->> " + snap.val());
		stockCount = snap.val();
		console.log("this.stockCount ->> " + stockCount);
		updates["/stocksUsedCount"] = (stockCount + document.getElementById('consume-paper-count').value);
	});

	console.log("stockCount ->> " + stockCount);

	updates["/stocksUsed/" + stockKey] = {
		stockJobOrderPaperCount: document.getElementById('consume-paper-count').value,
		stockJobOrderNo: document.getElementById('consume-job-order-no').value
	};
//	updates["/stocksUsedCount"] = (stockCount + document.getElementById('consume-paper-count').value);

//	this.database.ref("stocks/" + key).update(updates[key]).catch(function(error) {
//		console.error('Error writing new order to Firebase Database', error)});

	this.database.ref("stocks/" + key).update(updates);
};
