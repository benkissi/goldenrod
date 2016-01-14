Template.accounts.helpers({
  acounts : function(){
    var user = Meteor.userId();
		return Acounts.find({userId: user}, {sort: {submitted: -1}});
	}
});

