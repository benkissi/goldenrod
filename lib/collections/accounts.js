Acounts = new Mongo.Collection('acounts');

Acounts.allow({
	update: function(userId, account) { return ownsDocument(userId, account); },
	remove: function(userId, account) { return ownsDocument(userId, account); }
});

Acounts.deny({
	update: function(userId, account, fieldNames) {
// may only edit the following two fields:
return (_.without(fieldNames, 'accountNumber', 'accountName', 'accountTotal', 'dateCreated',
	'idType','idNumber','picture').length > 0);
}
});

validateAccount = function (account) {
	var errors = {};
	if (!account.accountName)
		errors.accountName = "Please fill in the account name";
	if (!account.accountNumber)
		errors.accountNumber = "Please fill in the account number";
	if (!account.accountTotal)
		errors.accountTotal = "Please fill in the amount";
	if (!account.dateCreated)
		errors.dateCreated = "Please fill in the date";
	if (!account.idType)
		errors.idType = "Please fill in the ID type";
	if (!account.idNumber)
		errors.idNumber = "Please fill in the ID number";
	if (!account.picture)
		errors.idNumber = "Please fill in the ID number";
	return errors;
}

Acounts.deny({
	update: function(userId, post, fieldNames, modifier) {
		var errors = validatePost(modifier.$set);
		return errors.accountName||errors.accountNumber||errors.accountTotal||errors.dateCreated
			||errors.idType||errors.idNumber;
	}
});

Meteor.methods({
	accountsInsert: function(accountAttributes) {
		check(Meteor.userId(), String);
		check(accountAttributes, {
			accountNumber: String,
			accountName: String,
			accountTotal: Number,
			dateCreated: String,
			idType : String,
			idNumber :String,
			picture : String,
			pictureID: String
		});

		var accountWithSameNumber = Acounts.findOne({accountNumber: accountAttributes.accountNumber});
		if (accountWithSameNumber) {
			return {
				accountExists: true,
				_id: accountWithSameNumber._id
			}
		}
		var user = Meteor.user();
		var account = _.extend(accountAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date()
		});
		var accountId = Acounts.insert(account);
		return {
			_id: accountId
		};
	}
});