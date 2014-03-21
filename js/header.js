//function Header(){};
var autoHeader={
		osPlatform:window.navigator.platform,
		osName:window.navigator.appVersion,
		osVer:window.navigator.appVersion
		
};
function Header(n, v)
{
	this.name=n;
	this.value=v;
}
function loadHeaders(element)
{
	$.getJSON(URL_SERVICE_TESTPROFILE_HEADERS, function(data) {
		$(element).text(JSON.stringify(data.list));
	});
}

function getUAgent(){
	return BrowserDetect.browser;
};
function getUAgentVersion(){
	return BrowserDetect.version;
};
function getPlaform()
{
	//return navigator.platform;
	return BrowserDetect.OS;
};
function getPlaformArchitecture()
{
	//return navigator.platform;
	return BrowserDetect.Architrecture;
};
//http://www.w3schools.com/js/tryit.asp?filename=try_nav_all
//http://api.jquery.com/jQuery.browser/

//http://www.quirksmode.org/js/detect.html
var BrowserDetect = {
		init : function() {
			this.browser = this.searchString(this.dataBrowser)
					|| "An unknown browser";
			this.version = this.searchVersion(navigator.userAgent)
					|| this.searchVersion(navigator.appVersion)
					|| "an unknown version";
			this.OS = this.searchString(this.dataOS) || "an unknown OS";
			this.Architrecture = this.searchString(this.dataArch) || "an unknown Architecture";
		},
		searchString : function(data) {
			for ( var i = 0; i < data.length; i++) {
				var dataString = data[i].string;
				var dataProp = data[i].prop;
				this.versionSearchString = data[i].versionSearch
						|| data[i].identity;
				if (dataString) {
					if (dataString.indexOf(data[i].subString) != -1)
						return data[i].identity;
				} else if (dataProp)
					return data[i].identity;
			}
		},
		searchVersion : function(dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1)
				return;
			return parseFloat(dataString.substring(index
					+ this.versionSearchString.length + 1));
		},
		dataBrowser : [ {
			string : navigator.userAgent,
			subString : "Chrome",
			identity : "Chrome"
		}, {
			string : navigator.userAgent,
			subString : "OmniWeb",
			versionSearch : "OmniWeb/",
			identity : "OmniWeb"
		}, {
			string : navigator.vendor,
			subString : "Apple",
			identity : "Safari",
			versionSearch : "Version"
		}, {
			prop : window.opera,
			identity : "Opera",
			versionSearch : "Version"
		}, {
			string : navigator.vendor,
			subString : "iCab",
			identity : "iCab"
		}, {
			string : navigator.vendor,
			subString : "KDE",
			identity : "Konqueror"
		}, {
			string : navigator.userAgent,
			subString : "Firefox",
			identity : "Firefox"
		}, {
			string : navigator.vendor,
			subString : "Camino",
			identity : "Camino"
		}, { // for newer Netscapes (6+)
			string : navigator.userAgent,
			subString : "Netscape",
			identity : "Netscape"
		}, {
			string : navigator.userAgent,
			subString : "MSIE",
			identity : "Explorer",
			versionSearch : "MSIE"
		}, {
			string : navigator.userAgent,
			subString : "Gecko",
			identity : "Mozilla",
			versionSearch : "rv"
		}, { // for older Netscapes (4-)
			string : navigator.userAgent,
			subString : "Mozilla",
			identity : "Netscape",
			versionSearch : "Mozilla"
		} ],
		dataOS : [ {
			string : navigator.platform,
			subString : "Win",
			identity : "Windows"
		}, {
			string : navigator.platform,
			subString : "Mac",
			identity : "Mac"
		}, {
			string : navigator.userAgent,
			subString : "iPhone",
			identity : "iPhone/iPod"
		}, {
			string : navigator.platform,
			subString : "Linux",
			identity : "Linux"
		} ],
		dataArch : [ {
			string : navigator.platform,
			subString : "i386",
			identity : "i386"
		}, {
			string : navigator.platform,
			subString : "i686",
			identity : "i686"
		}, {
			string : navigator.userAgent,
			subString : "x86_64",
			identity : "x86_64"
		}, {
			string : navigator.platform,
			subString : "PPC",
			identity : "PPC"
		} ]
	};
	BrowserDetect.init();