Template.header.helpers({
	acounts : function(){
		return Acounts.find({}, {sort: {submitted: -1}});
	}
});

Template.header.events({
	'submit form': function(e){
		e.preventDefault();

		var searchInput = $(e.target).find('[name = searchInput]').val();
		var found = Acounts.findOne({accountNumber: searchInput});
		var _id = found._id
		console.log(_id);

		Router.go('accountPage', {_id: _id});
		
	}
})