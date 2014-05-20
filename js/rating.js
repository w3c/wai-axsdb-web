/**
 * for future
 * @constructor
 */

function Rating() {
	this.ratingValue = null;
	this.ratedId = -1;
	this.ratedType = null;
	this.comment = null;
	this.experience = -1;
	this.setData = function(data) {
		for ( var property in data) {
			this[property] = data[property];
		}
	};
	this.save = function() {
		var obj = this;
		$.ajax({
			url : URL_SERVICE_INSERT_RATING,
			type : 'POST',
			dataType : "json",
			data : obj,
			error : function() {
				console.log("testunit rating error");
			},
			success : function(data) {
				// obj.setData(data);
				msg2user("ok");
			}
		});
	};
}
Rating.prototype.calculateRatingByRatedId = function(ratedId, holdername) {
	$.ajax({
		url : URL_SERVICE_CALCULATE_RATING + "/" + ratedId,
		type : 'GET',
		dataType : "json",
		error : function() {
			console.log("rating rating error");
		},
		success : function(data) {
			console.log(data);
			msg2user("ok");
			if(data==null)
				return data="no rating yet";
			$(holdername).html(data);
		}
	});
};
Rating.prototype.findRatingsByRatedId = function(ratedId) {
	$.ajax({
		url : URL_SERVICE_GET_RATINGS_BYRATEDID + "/" + ratedId,
		type : 'GET',
		dataType : "json",
		error : function() {
			console.log("rating rating error");
		},
		success : function(data) {
			console.log(data);
			msg2user("ok");
		}
	});
};

Rating.showRatings=function()
{
    if(accessdb.session.ratings.length>0)
    {
        var strVar="";      
        for ( var ratingId in accessdb.session.ratings) {
            strVar += "<tr>";
            var rating = accessdb.session.ratings[ratingId];
            strVar += "<td>" +rating.ratedId + "<\/td>";
            strVar += "<td>" + rating.ratingValue+ "<\/td>";
            strVar += "<\/tr>";
        }       
        $("#ratingsList table tbody").html(strVar);
    }   
    else
        $("#ratingsList table tbody").html("");
};
Rating.clearRatings=function()
{
    accessdb.session.ratings = new Array();
    this.showRatings();
};
Rating.isTestUnitInRatings=function(unitid)
{
    for ( var resId in accessdb.session.ratings) {
        var rating = accessdb.session.ratings[resId];
        if(rating.ratedId==unitid)
            return true;
    }
    return false;
};
Rating.addRating = function(rType)
{
    var testUnit = new TestUnit();
    testUnit.loadByIdSync(accessdb.session.currentTestUnitId);
    //if(!this.isTestUnitInRatings(testUnit.testUnitId))
    //{
        var rating = new Rating();
        rating.ratedId = testUnit.testUnitId;
        rating.ratedType = rType;
        rating.ratingValue = $("#rating").val();
        accessdb.session.ratings.push(rating);
       // dialog2user("Rating saved!");         }
    //else
        //dialog2user("You have already rated this one!");
};