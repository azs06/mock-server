module.exports = function (){
	var faker = require('faker');
	var _ = require('lodash');

	return {
		companies: _.times(50, function(n){
			return {
				id: n,
				companyName: faker.company.companyName(),
				email: faker.internet.email(),
				address: faker.address.streetAddress("###")	
			}
		})
	}
}