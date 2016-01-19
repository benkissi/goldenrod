Template.adminAccount.helpers({
  adminDisplay: function(){
    if(Meteor.user().username == "admin")
      return true
    else
      return false
  },
  customerUsers: function(){
    return Meteor.users.find();
  },
  customerTransactions: function(){
    return Transactions.find();
  },
  customerAccounts: function(){
    return Acounts.find();
  }
});

