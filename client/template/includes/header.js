Template.header.helpers({
  accountsExist: function () {
    return Acounts.find({userId: Meteor.userId()}).count() > 0;
  }
});

Template.header.events({
	'submit form': function(e){
		e.preventDefault();

		var searchInput = $(e.target).find('[name = searchInput]').val();
		if (searchInput !== ""){
			var found = Acounts.findOne({accountNumber: searchInput});
			
			var id = found._id;
			Router.go('accountPage', {_id:id});
		} else {
			return Errors.throw("Please input an account number");
		}
		
	}
});