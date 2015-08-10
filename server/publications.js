Meteor.publish('acounts', function(){
	return Acounts.find();
})

Meteor.publish('transactions', function(){
	return Transactions.find();
})

Meteor.publish("pictures", function(){
  return Pictures.find();
});