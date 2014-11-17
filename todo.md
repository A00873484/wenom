# WeNomYou TODO    

## High Fidelity Prototype (Due Nov 23rd 2014)    
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
				- [x] User should be able to return to in progress creation, and continue (with prior data pre-filled)
			- [x] Create view for challenge explore page

		Authentication
			- [x] User login/logout
			- [ ] Append authentication token to every request

		Session Management
			- [x] Refreshing should keep the user logged in

		Routing
			- [x] All routes should map through the Main Controller in index.html, then be rerouted accordingly
			- [x] Routing for controllers and views
				- [x] Title should change with route changes

		Registration
			- [x] User registration
			
		Challenge
			- [x] Challenge creation
				- [x] Image upload/drag and drop
				- [x] Rich editor
				- [x] Date input/duration + dynamic updating end date
			- [ ] Detailed challenge view
				- [ ] If challenge creator, edit challenge to update nominee status/proof

		Profile
			- [ ] Update profile
				- [x] Image upload/drag and drop
				- [x] Rich editor
				
		Development/Deployment
			- [x] Live reloading to help save development time
			- [x] SASS concatenation/compilation to CSS
			- [x] CSS minification
			- [x] JS concatenation and minification
			- [x] Dynamic generation of script dependencies for index.html (Angular scripts only)
			
		BLOCKERS
			- Backend very minimal, impossible to connect to backend at the moment
			- Payment integration likely impossible at this point; a lot is blocked due to backend (filter/sort/search/register/login/create/update)

	Back-end (Enoch, Daniel)
