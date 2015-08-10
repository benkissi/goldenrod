Transactions = new Mongo.Collection('transactions');

Transactions.allow({
	update: function(userId, account) { return ownsDocument(userId, account); },
	remove: function(userId, account) { return ownsDocument(userId, account); },
});

validateTransaction = function (transaction) {
	var errors = {};
	if (!transaction.transactionDate)
		errors.transactionDate = "Please fill in the transaction date";
	if (!transaction.transactionAmount)
		errors.transactionAmount = "Please fill in the transaction amount";
	return errors;
}


Meteor.methods({
	transactionInsert: function(transactionAttributes){
		check(Meteor.userId(), String);
		check(transactionAttributes, {
			transactionDate : String,
			accountNumber: String,
			accountName: String,
			transactionType: String,
			transactionAmount : Number,
			balance : Number
		});

		var user = Meteor.user();
		var transaction = _.extend(transactionAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date()
		});
		var transactionId = Transactions.insert(transaction);
		return {
			_id: transactionId
		};
	}
});
