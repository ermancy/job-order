/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//'use strict';
//
//const functions = require('firebase-functions');
//const admin = require('firebase-admin');
//admin.initializeApp(functions.config().firebase);
//
//// Keeps track of the length of the 'stocksUsed' child list in a separate property.
//exports.sumStockUsed = functions.database.ref('/stocks/{stockid}/stocksUsed/{stocksUsedid}').onWrite(event => {
//  const collectionRef = event.data.ref.parent;
//  const countRef = collectionRef.parent.child('stocksUsedCount');
//  
//  var stockSum = event.data.ref.child('stockJobOrderPaperCount').once('value');
//  
//  console.log(stockSum);
//
//  // Return the promise from countRef.transaction() so our function 
//  // waits for this async event to complete before it exits.
//  return countRef.transaction(current => {
//    if (event.data.exists() && !event.data.previous.exists()) {
//        console.log(current);
//        return (current + stockSum);
//    }
//  }).then(() => {
//    console.log('Sum updated.');
//  });
//});

