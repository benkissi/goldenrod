Template.header.helpers({
	acounts : function(){
		return Acounts.find({}, {sort: {submitted: -1}});
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
})