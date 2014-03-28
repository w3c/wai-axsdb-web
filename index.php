<?php
	session_start();
?>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Accessibility Support Database</title>
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="css/wai-act.css">
    <link rel="stylesheet" href="css/icomoon/style.css">
    <script type="text/javascript" src="js/lib/modernizr.min.js"></script>
    <script type="text/javascript" src="js/lib/underscore-min.js"></script>
    <script type="text/javascript" src="js/lib/jquery-2.1.0.min.js"></script>

    <script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
    <script type="text/javascript" charset="utf-8" src="js/lib/jquery.form.js"></script>
    <script type="text/javascript" src="js/lib/backbone-min.js"></script>
    <script type="text/javascript" src="js/lib/jquery.treevue.js"></script>
    <script type="text/javascript" src="js/lib/jquery.treevue.export.js"></script>
    <script type="text/javascript" src="js/lib/jquery.treevue.import.js"></script>
    <script type="text/javascript" src="js/accessdb.js"></script>
    <script type="text/javascript" src="js/utils.js"></script>
    <script type="text/javascript" src="js/API.js"></script>
    <script type="text/javascript" src="js/testing-session.js"></script>
    <script type="text/javascript" src="js/filter.js"></script>
    <script type="text/javascript" src="js/tree-helper.js"></script>
    <script type="text/javascript" src="js/testunit.js"></script>
    <script type="text/javascript" src="js/testingprofile.js"></script>
    <script type="text/javascript" src="js/header.js"></script>

    <script type="text/javascript" src="js/mockup.js"></script>
 <script type="text/javascript">
 	accessdb.config.sessionId = "<?php echo session_id();?>";
 </script>
</head>
<body>
<header role="banner">
    <div class="w3c-wai-header">
        <a href="/"><img src="http://w3.org/2008/site/images/logo-w3c-mobile-lg" alt="W3C" height="53" width="90"></a>
        <a href="/" class="wai"><img src="http://www.w3.org/WAI/images/wai-temp" alt="Web Accessibility Initiative"></a>
    </div>
</header>
<main role="main" aria-live="assertive">
        <div role="alert" id="msg2user" title="Feedback dialog"></div>

<?php
	foreach (glob("pages/*.html") as $filename)
	{
		include $filename;
	}
	?>
</main>
<footer role="complimentary" aria-label="Document info">

</footer>
<?php include "templates.html"; ?>

<script type="text/javascript" src="js/router.js"></script>
<script type="text/javascript" src="js/main.js"></script>

</body>
</html>
