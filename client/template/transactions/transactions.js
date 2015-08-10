Template.transactions.helpers({
	transactions : function(){
		return Transactions.find({}, {sort: {submitted: -1}});
	}	
})