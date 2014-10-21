# WeNomYou TODO    

## Medium Fidelity Prototype (Due Oct 25th 2014)    
	Front-end (Jay)
		API
			- [ ] Implement easily consumable API for the front-end, using endpoints exposed by the back-end
			- [ ] Grab data using the appropriate endpoints (register/login/challenge creation/explore)

		Views
			- [x] Create view for homepage
				- [ ] Need images in placeholders
			- [x] Create view for register/login
			- [x] Create view for challenge creation
				- [ ] Refine view with error handling, accessibility features
				- [ ] User should be able to return to in progress creation, and continue (with prior data pre-filled)
			- [ ] Create view for challenge explore page

		Authentication
			- [ ] User login/logout
			- [ ] Append authentication token to every request

		Session Management
			- [ ] Refreshing should keep the user logged in

		Routing
			- [x] All routes should map through the Main Controller in index.html, then be rerouted accordingly
			- [x] Routing for controllers and views
				- [ ] Title should change with route changes

		Registration
			- [ ] User registration

		Development/Deployment
			- [x] Live reloading to help save development time
			- [x] SASS concatenation/compilation to CSS
			- [x] CSS minification
			- [x] JS concatenation and minification
			- [x] Dynamic generation of script dependencies for index.html (Angular scripts only)

	Back-end (Enoch, Daniel)
