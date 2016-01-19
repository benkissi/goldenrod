Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() {return Meteor.subscribe('pictures');}
});

Router.route('/', {
	name: 'home',
});

Router.route('/statement/:accountNumber', {
	name: 'statement',
	data: function(){
		return {transactions: Transactions.find({accountNumber: this.params.accountNumber}).fetch()}
	}
});

Router.route('/accounts',{
	name: 'accounts'
});

Router.route('/transactions',{
	name: 'transactions'
});

Router.route('/transactions/:_id',{
	name : 'transDetails',
	data: function(){return Transactions.findOne(this.params._id)}
});

Router.route('accounts/:_id',{name: 'accountPage',
	data: function(){return Acounts.findOne(this.params._id)}
});

// Router.route('/accounts/:_id/edit', {
// 	name: 'accountEdit',
// 	data: function() { return Acounts.findOne(this.params._id); }
// });

Router.route('/new_account', {name: 'newAccount'});

Router.route('/admin', {
	name: 'AdminAccount'
});

var requireLogin = function() {
	if (! Meteor.user()) {
		this.render('accessDenied');
	} else {
		this.next();
	}
}

Router.onBeforeAction('dataNotFound', {only: 'accountPage'});
Router.onBeforeAction(requireLogin, {only: 'newAccount'});
Router.onBeforeAction(requireLogin, {only: 'accounts'});
Router.onBeforeAction(requireLogin, {only: 'transDetails'});
Router.onBeforeAction(requireLogin, {only: 'transactions'});
Router.onBeforeAction(requireLogin, {only: 'accountEdit'});
Router.onBeforeAction(requireLogin, {only: 'accountPage'});



