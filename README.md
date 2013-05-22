### Create Project
* assuming prior node environment setup
* <a href="git@github.com:nomasgrim/mistress-jade.git">clone this project</a>
* cp a few things from this project
	* src
	* docs
	* assets
	* test
	* Gruntfile.js
	* package.js
	* README.md
* install grunt
	<code>npm install -g grunt-cli</code>
* install packages
	<code>npm install</code>
* start node server
	<code>grunt connect:site:keepalive</code>
* checkout localhost:8000
	* Jade SHITs (simple html insomniac turrets shit)

### Discover JADE
#### Explore
* now lets edit and play in jade
* jade files are in the src dir
	* src/markup
	* index.jade - src/markup/htdocs
		* extends
			* templates
				* main.jade
				* notice include mixins, advanced get back to it and have shane exlain better
				* edit title
				* notice blocks
		* copy paste this markdown over what's in :markdown
	* refresh localhost
* stylus files are in styles/lib/base.styl
	* removed solarized, and such
#### Dress her up with Stylus

### Stylus, the Mary Kay of Styling, it's cake 'd ... ?
* variables
* imports
* shane explain advanced features
	* http://www.youtube.com/watch?v=P-hFbuWIKAA
