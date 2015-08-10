Template.newAccount.created = function() {
	Session.set('accountSubmitErrors', {});
}


Template.newAccount.helpers({
	errorMessage: function(field) {
		return Session.get('accountSubmitErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('accountSubmitErrors')[field] ? 'has-error' : '';
	}
});


Template.newAccount.events({
	
	  'change .fileInput': function(event, template) {
	    FS.Utility.eachFile(event, function(file) {
	      Pictures.insert(file, function (err, fileObj) {
	        if (err){
	          console.log(err);
	        } else {
	            // handle success depending what you need to do
	          var userId = Meteor.userId();
	          pictureURL = {
	            "picture": "/cfs/files/pictures/" + fileObj._id
	          };
	          // Meteor.users.update(userId, {$set: imagesURL});
	          console.log(pictureURL)
	          return pictureURL;
	        }
	      });
	    });
	  },
	'submit form' : function(e){
		e.preventDefault();

				var account = {
					accountNumber: $(e.target).find('[name = accountNumber]').val(),
					accountName : $(e.target).find('[name = accountName]').val(),
					accountTotal : parseFloat($(e.target).find('[name = amount]').val()),
					dateCreated : $(e.target).find('[name = dateCreated]').val(),
					idType : $(e.target).find('[name = idType]').val(),
					idNumber: $(e.target).find('[name = idNumber]').val(),
					// picture : $(e.target).find('[name = pic]').val()
					picture: {"image" :pictureURL}
				};

		// account._id = Acounts.insert(account);
		// Router.go('accountPage', account);

		var errors = validateAccount(account);
		if (errors.accountName||errors.accountNumber||errors.accountTotal||errors.dateCreated
			||errors.idType||errors.idNumber||errors.picture)
			return Session.set('accountSubmitErrors', errors);

		Meteor.call('accountsInsert', account, function(error, result) {
			// display the error to the user and abort
			if (error)
				return throwError(error.reason);

			if (result.accountExists)
				throwError('This account number has already been created');

			Router.go('accountPage', {_id: result._id});
		});

	}
});

