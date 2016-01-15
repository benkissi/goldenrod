Template.newAccount.created = function() {
	Session.set('accountSubmitErrors', {});
}

Template.newAccount.rendered = function(){
	$('.my-datepicker').datepicker({
		format: 'dd/mm/yyyy',
		startDate: '-3d'
	})

	
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
	          // imgID = fileObj.id;
	          image ={
	          	imageURL:"/cfs/files/pictures/" + fileObj._id,
	          	imageID: fileObj._id
	          }

	          
	          // Meteor.users.update(userId, {$set: imagesURL});
	          
	          return image;
	      }
	  });
		});
	},
	'submit form' : function(e){
		e.preventDefault();
		if(typeof image == 'undefined'){
			return Error.throw("Please insert an image");
		}
		var account = {
			accountNumber: $(e.target).find('[name = accountNumber]').val(),
			accountName : $(e.target).find('[name = accountName]').val(),
			accountTotal : parseFloat($(e.target).find('[name = amount]').val()),
			dateCreated : $(e.target).find('[name = dateCreated]').val(),
			idType : $(e.target).find('[name = idType]').val(),
			idNumber: $(e.target).find('[name = idNumber]').val(),
			// picture : $(e.target).find('[name = pic]').val()
			picture: image.imageURL,
			pictureID: image.imageID
			};

		var errors = validateAccount(account);
		if (errors.accountName||errors.accountNumber||errors.accountTotal||errors.dateCreated
			||errors.idNumber||errors.picture)
			return Session.set('accountSubmitErrors', errors);

		Meteor.call('accountsInsert', account, function(error, result) {
			// display the error to the user and abort
			if (error)
				return Error.throw(error.reason);

			if (result.accountExists)
				Error.throw('This account number has already been created');

			Router.go('accountPage', {_id: result._id});
		});

	}
});

