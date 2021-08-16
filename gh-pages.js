var ghpages = require('gh-pages');

ghpages.publish(
	'public',
	{
		branch: 'gh-pages',
		repo: 'https://github.com/KevChaplin/rate-my-racing',
		user: {
			name: 'Kevin Chaplin', // update to use your name
			email: 'kevchaplin44@gmail.com' // Update to use your email
		},
		dotfiles: true
	},
	() => {
		console.log('Deploy Complete!');
	}
);
