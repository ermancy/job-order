JobOrder.prototype.loadStocks = function() {
	// Reference to the /stocks/ database path.
	this.stocksRef = this.database.ref('stocks');
	// Make sure we remove all previous listeners.
	this.stocksRef.off();

	// Loads the last 12 stocks and listen for new ones.
	var setStock = function(data) {
		var val = data.val();
		this.displayStock(data.key, val.stockNo, val.stockDate, val.stockDateDesc, val.stockJobOrderNo, val.stockPaperType, val.stockPaperCount, val.stocksUsedCount, val.stockPaperWeight, val.stockPaperSize, val.stockPaperUnitPrice);
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
			stockPaperUnitPrice: this.stockPaperUnitPriceInput.value,
			stocksUsedCount: 0
		}).then(function() {
			// Clear order text field and SEND button state.
			this.resetMaterialTextfield();
			this.toggleButton();
		}.bind(this)).catch(function(error) {
			console.error('Error writing new order to Firebase Database', error);
		});
	}
};

JobOrder.prototype.displayStock = function(key, stockNo, stockDate, stockDateDesc, stockJobOrderNo, stockPaperType, stockPaperCount, stockPaperUsed, stockPaperWeight, stockPaperSize, stockPaperUnitPrice) {
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
	div.querySelector('.stockPaperLast').textContent = parseInt(stockPaperCount) - parseInt(stockPaperUsed);
	div.querySelector('.stockPaperWeight').textContent = stockPaperWeight;
	div.querySelector('.stockPaperSize').textContent = stockPaperSize;
	div.querySelector('.stockPaperUnitPrice').textContent = stockPaperUnitPrice;
	
	//Click events
	div.querySelector('.consumeButton').addEventListener('click', function() {
		console.log('consumed ' + key);
		const query = firebase.database().ref('stocks/' + key);
	
		query.once('value').then(function(snap){
			var data = snap.val();

			var stockDateString = new Date(data.stockDate);
			
			const paperLast = parseInt(data.stockPaperCount) - parseInt(data.stocksUsedCount);
			
			console.log('paper last: ' + paperLast +' '+ data.stockPaperCount + ' ' + data.stocksUsedCount);
			
			document.getElementById('stock-key').value = key;
			document.getElementById('consume-date-div').MaterialTextfield.change(stockDateString.toLocaleString());
			document.getElementById('consume-paper-type-div').MaterialTextfield.change(data.stockPaperType);
			document.getElementById('consume-paper-count-div').MaterialTextfield.change(data.stockPaperCount);
			document.getElementById('consume-paper-last-div').MaterialTextfield.change(paperLast);
			document.getElementById('consume-paper-weight-div').MaterialTextfield.change(data.stockPaperWeight);
			document.getElementById('consume-paper-size-div').MaterialTextfield.change(data.stockPaperSize);
			document.getElementById('consume-paper-unit-price-div').MaterialTextfield.change(data.stockPaperUnitPrice);
			
			document.getElementById('stocks-used').innerHTML = '<div class="stockJobOrderNo">Talep No</div><div class="stockJobOrderPaperCount">Kullanılan Tabaka</div><div class="stockConsumePaperNotes">Açıklama</div>';
			firebase.database().ref('stocks/' + key + '/stocksUsed').off();
			
			var listUsed = function(snap) {
				const val = snap.val();
				
				var div = document.getElementById(snap.key);
				// If an element for that order does not exists yet we create it.
				if (!div) {
					var container = document.createElement('div');
					container.innerHTML = JobOrder.STOCK_USED_TEMPLATE;
					div = container.firstChild;
					div.setAttribute('id', snap.key);
					document.getElementById('stocks-used').appendChild(div);
				}

				div.querySelector('.stockJobOrderNo').textContent = val.stockJobOrderNo;
				div.querySelector('.stockJobOrderPaperCount').textContent = val.stockJobOrderPaperCount;
				div.querySelector('.stockConsumePaperNotes').textContent = val.notes;
			};
			firebase.database().ref('stocks/' + key + '/stocksUsed').on('child_added', listUsed);
			firebase.database().ref('stocks/' + key + '/stocksUsed').on('child_changed', listUsed);
		});
		
		document.getElementById('stocks-card').setAttribute('hidden', 'true');
		document.getElementById('stock-out-card').removeAttribute('hidden');
		document.getElementById('stock-used-card').removeAttribute('hidden');
		document.getElementById('stock-info-card').removeAttribute('hidden');
		
		document.getElementById('consume-submit').removeAttribute('disabled');
		document.getElementById('consume-clear').removeAttribute('disabled');
	});
	
	// Show the card fading-in.
//	setTimeout(function() {div.classList.add('visible')}, 1);
	this.stockList.scrollTop = this.stockList.scrollHeight;
	this.stockNoInput.focus();
};

JobOrder.prototype.updateStock = function() {
	const key = document.getElementById('stock-key').value;
	const stockToUpdate = this.database.ref("stocks/" + key);
	const stockKey = stockToUpdate.child("stocksUsed").push().key;
	var updates = {};
 
	return stockToUpdate.child("stocksUsedCount").once('value').then(function(snap){
		const stockCount = snap.val();
		const stocksUC = parseInt(stockCount) + parseInt(document.getElementById('consume-paper-input').value);
		console.log(stocksUC);
		updates["/stocksUsedCount"] = stocksUC;
		updates["/stocksUsed/" + stockKey] = {
			stockJobOrderPaperCount: document.getElementById('consume-paper-input').value,
			stockJobOrderNo: document.getElementById('consume-job-order-no').value,
			notes: document.getElementById('consume-paper-notes').value
		};
		stockToUpdate.update(updates);
	}).then(function() {
		// Clear order text field and SEND button state.
//		this.resetMaterialTextfield();
//		document.getElementsByClassName('mdl-textfield input').value = '';
//		document.getElementsByClassName('mdl-textfield__input').parentNode.MaterialTextfield.boundUpdateClassesHandler();
		
		document.getElementById('stocks-card').setAttribute('hidden', 'true');
		document.getElementById('stock-out-card').removeAttribute('hidden');
		document.getElementById('stock-used-card').removeAttribute('hidden');
		
		document.getElementById('consume-submit').setAttribute('disabled', 'true');
		document.getElementById('consume-clear').setAttribute('disabled', 'true');
	}).catch(function(error) {console.error('Error:', error)});
};

