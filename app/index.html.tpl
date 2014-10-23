<!DOCTYPE html>
<html ng-app="WeNomYou">
<head>
	<base href="/">
	<title>WeNomYou</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
	<script type="text/javascript" src="bower_components/angular/angular.min.js"></script>
	<script type="text/javascript" src="bower_components/angular-route/angular-route.min.js"></script>
	<script type="text/javascript" src="bower_components/angular-bootstrap/ui-bootstrap.min.js"></script>
	<script type="text/javascript" src="bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
	<script type="text/javascript" src="bower_components/semantic-ui/build/packaged/javascript/semantic.min.js"></script>
	<script type="text/javascript" src="bower_components/textAngular/dist/textAngular-sanitize.min.js"></script>
	<script type="text/javascript" src="bower_components/textAngular/dist/textAngular.min.js"></script>
	<link rel="stylesheet" href="bower_components/semantic-ui/build/packaged/css/semantic.min.css">
	<!-- <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css"> -->
	<link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css">
	<%= scripts %>
	<%= css %>
</head>
<body ng-controller="MainCtrl">
	<div class="container ng-view"></div>
</body>
</html>