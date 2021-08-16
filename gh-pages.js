var ghpages = require('gh-pages');

ghpages.publish(
	'public',
	{
		branch: 'gh-pages',
		repo: 'https://github.com/KevChaplin/rate-my-racing',
		user: {
			name: 'Kevin Chaplin',
			email: 'kevchaplin44@gmail.com'
		},
		dotfiles: true
	},
	() => {
		console.log('Deploy Complete!');
	}
);
