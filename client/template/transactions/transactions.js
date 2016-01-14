Template.transactions.helpers({
	transactions : function(){
    var user = Meteor.userId();
		return Transactions.find({userId: user}, {sort: {submitted: -1}});
	}	
})