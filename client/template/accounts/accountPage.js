Template.accountPage.rendered = function(){
	$('.d-c').hide();
}

Template.accountPage.created = function() {
	Session.set('transactionSubmitErrors', {});
}


Template.accountPage.helpers({
	errorMessage: function(field) {
		return Session.get('transactionSubmitErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('transactionSubmitErrors')[field] ? 'has-error' : '';
	}
	
});

Template.accountPage.events({
	'submit form': function(e){
		e.preventDefault();
		var currentAccountId = this._id;
		var transactionAmount = parseFloat($(e.target).find('[name = transactionAmount]').val());
		var credit = {
			accountTotal : (parseFloat(this.accountTotal) + transactionAmount)
		}

		var accountNumber = this.accountNumber;
		var accountName = this.accountName;
		var transactionDate = $('#transDate').val();

		var transaction = {
			transactionDate : transactionDate,
			accountNumber: accountNumber,
			accountName: accountName,
			transactionType: "credit",
			transactionAmount : transactionAmount,
			balance : credit.accountTotal
		}

		var errors = validateTransaction(transaction);
		if (errors.transactionAmount||errors.transactionDate)
			return Session.set('transactionSubmitErrors', errors);

		if (confirm("Credit this account?")) {
			Acounts.update(currentAccountId, {$set: credit}, function(error) {
				if (error) {
					// display the error to the user
					alert(error.reason);
				} else {
					Router.go('accountPage', {_id: currentAccountId});
					error = {};
					return Session.set('transactionSubmitErrors', errors);
				}
			});
		}

		Meteor.call('transactionInsert', transaction, function(error, result) {
			// display the error to the user and abort
			if (error)
				return alert(error.reason);

			$('.transactionAmount').val('');
			$('#transDate').val('')
		});
	},

	'click .debit'	: function(e){
		e.preventDefault();
		var currentAccountId = this._id;
		var transactionAmount = parseFloat($('.transactionAmount').val());
		var debit = {
			accountTotal : (parseFloat(this.accountTotal) - transactionAmount)
		}

		var accountNumber = this.accountNumber;
		var accountName = this.accountName;
		var transactionDate = $('#transDate').val();

		var transaction = {
			transactionDate : transactionDate,
			accountNumber: accountNumber,
			accountName: accountName,
			transactionType: "debit",
			transactionAmount : transactionAmount,
			balance : debit.accountTotal
		}
		var errors = validateTransaction(transaction);
		if (errors.transactionAmount||errors.transactionDate)
			return Session.set('transactionSubmitErrors', errors);
		
		if(confirm('Do you want to debit this account')){
			Acounts.update(currentAccountId, {$set: debit}, function(error) {
				if (error) {
				// display the error to the user
				alert(error.reason);
				} else {
					Router.go('accountPage', {_id: currentAccountId});
					error = {};
					return Session.set('transactionSubmitErrors', errors);
					
				}
			});
		}

		Meteor.call('transactionInsert', transaction, function(error, result) {
			// display the error to the user and abort
			if (error)
				return alert(error.reason);

			$('.transactionAmount').val('');
			$('#transDate').val('')
		});
	},

	'click .debit-credit': function(e){
		e.preventDefault();
		$('.d-c').slideToggle("fast","swing");
	}
})
