Template.accountEdit.created = function() {
	Session.set('accountSubmitErrors', {});
}


Template.accountEdit.helpers({
	errorMessage: function(field) {
		return Session.get('accountSubmitErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('accountSubmitErrors')[field] ? 'has-error' : '';
	}
});

Template.accountEdit.rendered = function(){
	var id = Router.current().params['_id'];
	var picID = Acounts.findOne(id).pictureID;
	
	$('.datepicker').datepicker({
		format: 'dd/mm/yyyy',
		startDate: '-3d'
	})
	return picID;
}


Template.accountEdit.events({
	'change .fileInput': function(event, template) {
		Session.set('fileChange', true);
		FS.Utility.eachFile(event, function(file) {
			Pictures.insert(file, function (err, fileObj) {
				if (err){
					console.log(err);
				} else {
					var userId = Meteor.userId();
					image ={
						imageURL:"/cfs/files/pictures/" + fileObj._id,
						imageID: fileObj._id
					}
					return image;
				}
			});
		});
	},
	'submit form': function(e) {
		e.preventDefault();
		
		var currentAccountId = this._id;
		var id = Router.current().params['_id'];
		var picURL = Acounts.findOne(id).picture;
		
		var imageID = Acounts.findOne(id).pictureID;

		imagePath = ""
		if(Session.get("fileChange")) {
			imagePath = image.imageURL;

		} else {
			imagePath = picURL;
		}

		var accountProperties = {
			accountNumber: $(e.target).find('[name=accountNumber]').val(),
			accountName: $(e.target).find('[name=accountName]').val(),
			accountTotal: $(e.target).find('[name=amount]').val(),
			dateCreated: $(e.target).find('[name=dateCreated]').val(),
			idType: $(e.target).find('[name=idType]').val(),
			idNumber: $(e.target).find('[name=idNumber]').val(),
			picture:  imagePath,
			pictureID: imageID
		}
		  

		var errors = validateAccount(accountProperties);
		if (errors.accountName||errors.accountNumber||errors.accountTotal||errors.dateCreated
			||errors.idType||errors.idNumber)
			return Session.set('accountSubmitErrors', errors);

		Acounts.update(currentAccountId, {$set: accountProperties}, function(error) {
			if (error) {
			// display the error to the user
				return Error.throw(error.reason);
		} else {
			Router.go('accountPage', {_id: currentAccountId});
		}
	});
	},
	'click .delete': function(e) {
		e.preventDefault();
		if (confirm("Delete this account?")) {
			var currentAccountId = this._id;

			var id = Router.current().params['_id'];
			var imageID = Acounts.findOne(id).pictureID;
			if (imageID){
				Pictures.remove(imageID);
				Acounts.remove(currentAccountId);
			}else{
				Acounts.remove(currentAccountId);
			}
			
			Router.go('accounts');
		}
	}
});