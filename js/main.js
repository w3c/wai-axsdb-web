$(function()
{
    $("input").on("keypress", function(e)
    {
        var form = $(this).parents('form:first');
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13))
        {
            $(form).find(".default-enter").click();
            return false;
        }
        else
        {
            return true;
        }
    });
    $(document).bind('mobileinit', function()
    {
        $.mobile.selectmenu.prototype.options.nativeMenu = false;
        $.mobile.selectmenu.prototype.options.hidePlaceholderMenuItems = false;
        $.mobile.loader.prototype.options.text = "loading";
        $.mobile.loader.prototype.options.textVisible = true;
        $.mobile.loader.prototype.options.theme = "d";
        $.mobile.loader.prototype.options.html = "";
        $.mobile.pushStateEnabled = false;
        $.mobile.ignoreContentEnabled = true;
        $.mobile.initializePage = false;
    });
    $(document).bind("pagebeforechange", function(event, data)
    {
        $.mobile.pageData = (data && data.options && data.options.pageData) ? data.options.pageData : null;
    });
    $(".loginbox").on("click", function(event)
    {
        if (accessdb.session.userId != null)
        {
            event.preventDefault();
            accessdb.session.logout();
            $.mobile.changePage("#home");
        }
    });
    $(window).unload(function()
    {
        accessdb.session.saveLocalSession();
    });

    // handle custom UI events
    $("body").bind("accessdb-loggedout", function(e, id)
    {
        debug("accessdb-loggedout");
        msg2user("User logged out!");
        $(".userid").html("Login");
    });
    $("body").bind("accessdb-updateui, accessdb-loggedin, accessdb-loggedout", function(e, id)
    {
        debug("updateUI");
        accessdb.session.updateUI();
    });

    var initaccessdb = function()
    {
        for ( var property in accessdb.config.services)
        {
            accessdb.config.services[property] = accessdb.config.URL_WEBAPP_ROOT + accessdb.config.services[property];
        }
    }();
    //$.cookie.json = true;
    TestingSession.create();
    accessdb.session.updateUI();
    accessdb.session.profiles_index = 0;

});
