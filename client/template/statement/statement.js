Template.statement.helpers({
	statement: function(){
		return Transactions.find();
	}
})

Template.statement.rendered = function () {
	var number = Router.current().params['accountNumber'];
	var name = Transactions.findOne({accountNumber: number}).accountName;
	$('#account-name').text(name);
	$('#account-number').text(number);
};