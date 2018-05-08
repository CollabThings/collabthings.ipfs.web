import {isipfs} from './isipfs';

export {
	getProfile,
	newProfile
};

function splitter(str, l) {
	var strs = "";
	while (str.length > l) {
		var pos = str.substring(0, l).lastIndexOf(' ');
		pos = pos <= 0 ? l : pos;
		strs += str.substring(0, pos) + "\n";
		var i = str.indexOf(' ', pos) + 1;
		if (i < pos || i > pos + l)
			i = pos;
		str = str.substring(i);
	}
	strs += str;
	return strs;
}

function CProfile(profileid) 
{
	var me = this;
	
	this.data = {};
	this.data.profileid = profileid;
	this.data.thumbnail = "image.png";
	this.data.name = "default name " + Math.random();
	this.data.viewpublickeystring = "public key";
	this.data.publickeystring = "public key";
	this.data.loaded = false;
	this.data.link = "link";

	this.load = function(profileid) {	
		console.log("load profile " + profileid);
		if(profileid!=null) {	
			if(isipfs()) {
				ipfs.files.cat(profileid, function(err, profiledata) {
					console.log("load error " + err);

					if (err == null) {
						var profilecontent = profiledata.toString('utf8');
						me.parseData(profilecontent);
					} else {
						loadUrl(profileid);
					}				
				});
			} else {
				this.loadUrl(profileid);
			}
		}
	}

	this.loadUrl = function(profileid) {
		var idurl = "http://ipfs.io/ipfs/" + profileid;
		console.log("loading profile url " + idurl);
		$.get(idurl, function (profiledata) {
			me.parseData(profiledata);
		});

	}

	this.parseData = function(data) {
		console.log("profile data " + data);
		
		var profile = JSON.parse(data);

		Vue.util.extend(me.data, profile);
		me.data.publickeystring = this.data.publickeystring.replace(/\\n/g, "");
		me.data.viewpublickeystring = splitter(me.data.publickeystring, 40);
		
		me.data.link = "#/user/" + this.data.profileid;
		me.data.loaded = true;
	}
		
	if(profileid) {
		this.load(profileid);
	}
};

//var profile = new CProfile();

function getProfile(userid) {
	console.log("profile with userid " + userid);
	return new CProfile(userid);
}

function newProfile() {
	return new CProfile();
}