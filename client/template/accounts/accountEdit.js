Template.accountEdit.events({
	'submit form': function(e) {
		e.preventDefault();
		var currentAccountId = this._id;
		var accountProperties = {
			accountName: $(e.target).find('[name=accountName]').val(),
			accountNumber: $(e.target).find('[name=accountNumber]').val(),
			accountTotal: $(e.target).find('[name=amount]').val(),
			dateCreated: $(e.target).find('[name=dateCreated]').val(),
			idType: $(e.target).find('[name=idType]').val(),
			idNumber: $(e.target).find('[name=idNumber]').val(),
			picture: $(e.target).find('[name=picture]').val()
		}
		Acounts.update(currentAccountId, {$set: accountProperties}, function(error) {
			if (error) {
			// display the error to the user
			throwError(error.reason);
			} else {
				Router.go('accountPage', {_id: currentAccountId});
			}
		});
	},
	'click .delete': function(e) {
		e.preventDefault();
		if (confirm("Delete this account?")) {
			var currentAccountId = this._id;
			Acounts.remove(currentAccountId);
			Router.go('accounts');
		}
	}
});