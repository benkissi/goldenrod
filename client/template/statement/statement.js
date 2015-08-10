Template.statement.helpers({
	statement: function(){
		return Transactions.find();
	}
})

Template.statement.rendered = function () {
	var name = $(".entry .the-name 0-child").val();
	console.log(name);
	$('.account-name').val(name)
};