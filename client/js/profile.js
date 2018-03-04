function CProfile() 
{
	var me = this;
	this.data = {};
	this.data.profile = {};
	this.data.profile.thumbnail = "image.png";
	this.data.profile.name = "default name " + Math.random();

	this.load = function(profileid) {	
		console.log("load profile " + profileid);
		if(profileid!=null) {	
			me.data.identityid = profileid; 

			$.get("/ipfs/" + profileid, function(data) {
				me.parseData(data);
			});
			
			ipfs.files.cat(profileid, function(err, data) {
				console.log("load error " + err);
				console.log("profile url " + data.url);
				$.get(data.url, function(data) {
					me.parseData(data);
				});
			});

		}
	}
	
	this.parseData = function(data) {
		console.log("profile data " + data);
		
		me.data.profile = JSON.parse(data);
		me.data.profile.publickeystring = splitter(me.data.profile.publickeystring, 40);
			
		setProfileData(me.data);		
	}
	
	var url = new URL(window.location.href);
	var profileid = url.searchParams.get("profile");
	
	this.load(profileid);
};

function setProfileData(data) {
	console.log("set profile data");
	var profiletmpl = _.template($('#ProfileTemplate').html());
	$("#profile").append(profiletmpl(data));
}	

new CProfile();
