<?php
	session_start();
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Accessibility Support Database</title>
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css">
    <link rel="stylesheet" href="css/wai-act.css">
    <link rel="stylesheet" href="css/icomoon/style.css">
    <link rel="stylesheet" href="css/codemirror.css" />

    <script type="text/javascript" src="js/lib/modernizr.min.js"></script>
</head>
<body class="axsdb">
<header role="banner">
    <div class="w3c-wai-header">
        <a href="/"><img src="img/w3c.png" alt="W3C" width="90"></a>
        <a href="/WAI/" class="wai"><img src="img/wai.png" alt="Web Accessibility Initiative"></a>
    </div>
    <div class="page-title">
        Accessibility Support Database
        <span class="subheading"><span class="unapproved">Unapproved Prototype</span></span>
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

    <div>
        <ul>
      <li><strong>Development Team:</strong> Shadi Abou-Zahra (Project Lead, W3C WAI), Evangelos Vlachogiannis (Fraunhofer Institute), Eric Eggert (W3C WAI), Wilco Fiers (accessibility.nl), Daniel Pöll (Johannes Kepler University Linz), and Bim Egan (W3C WAI).</li>
      <li><strong>Developed with support</strong> from the <a href="http://www.w3.org/WAI/ACT/">WAI-ACT</a> project, co-funded by the European Commission <abbr title="Information Society Technologies">IST</abbr> Programme.</li>
    </ul>

    <p><strong>This is a prototype that is not yet approved. We are refining the code to fix known bugs. Please send bug reports and improvement suggestions through the <a href="https://github.com/w3c/wai-axsdb-web/issues">GitHub Issues List</a>.</strong></p>
    <div class="copyright">
      <p>
        <a rel="Copyright" href="http://www.w3.org/Consortium/Legal/ipr-notice#Copyright">Copyright</a> © 2014
        <a href="http://www.w3.org/"><abbr title="World Wide Web Consortium">W3C</abbr></a><sup>®</sup>
                (
                    <a href="http://www.csail.mit.edu/"><abbr title="Massachusetts Institute of Technology">MIT</abbr></a>,
                    <a href="http://www.ercim.org/"><abbr title="European Research Consortium for Informatics and Mathematics">ERCIM</abbr></a>,
                    <a href="http://www.keio.ac.jp/">Keio</a>,
            <a href="http://ev.buaa.edu.cn/">Beihang</a>), All Rights Reserved. W3C <a href="http://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer">liability</a>,
         <a href="http://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks">trademark</a>,               <a rel="Copyright" href="http://www.w3.org/Consortium/Legal/copyright-documents">document use</a>               and <a rel="Copyright" href="http://www.w3.org/Consortium/Legal/copyright-software">software licensing</a> rules apply. Your interactions with this site are in accordance with our <a href="http://www.w3.org/Consortium/Legal/privacy-statement#Public">public</a>
               and <a href="http://www.w3.org/Consortium/Legal/privacy-statement#Members">Member</a>privacy statements.</p>                   </div><!-- ends copyright -->
    </div>

</footer>
<?php include "templates.html"; ?>

        <script type="text/javascript" src="js/lib/underscore-min.js"></script>
        <script type="text/javascript" src="js/lib/jquery-2.1.0.min.js"></script>
        <script src="js/lib/codemirror/codemirror.js"></script>
        <script src="js/lib/codemirror/xml.js"></script>
        <script src="js/lib/codemirror/javascript.js"></script>
        <script src="js/lib/codemirror/css.js"></script>
        <script src="js/lib/codemirror/vbscript.js"></script>
        <script src="js/lib/codemirror/htmlmixed.js"></script>
        <script type="text/javascript" src="js/lib/jquery.multiFieldExtender-2.0.js"></script>

        <script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
        <script type="text/javascript" charset="utf-8" src="js/lib/jquery.form.js"></script>
        <script type="text/javascript" src="js/lib/backbone-min.js"></script>
        <script type="text/javascript" src="js/lib/jquery.treevue.js"></script>
        <script type="text/javascript" src="js/lib/jquery.treevue.export.js"></script>
        <script type="text/javascript" src="js/lib/jquery.treevue.import.js"></script>
        <script type="text/javascript" src="js/lib/jquery.peity.min.js"></script>
        <script type="text/javascript" src="js/lib/async.js"></script>
        <script type="text/javascript" src="js/accessdb.js"></script>
        <script type="text/javascript" src="js/utils.js"></script>
        <script type="text/javascript" src="js/API.js"></script>
        <script type="text/javascript" src="js/testing-session.js"></script>
        <script type="text/javascript" src="js/tree-helper.js"></script>
        <script type="text/javascript" src="js/testunit.js"></script>
        <script type="text/javascript" src="js/testingprofile.js"></script>
        <script type="text/javascript" src="js/header.js"></script>
        <script type="text/javascript" src="js/testing-helper.js"></script>
        <script type="text/javascript" src="js/testresult.js"></script>
        <script type="text/javascript" src="js/testresult-views.js"></script>
        <script type="text/javascript" src="js/code.js"></script>
        <script type="text/javascript" src="js/admin.js"></script>
        <script type="text/javascript" src="js/mockup.js"></script>

        <script type="text/javascript" src="js/router.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
    </body>
</html>
