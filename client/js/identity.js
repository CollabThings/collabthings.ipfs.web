var PARAM_IDENTITYID = "identityid";

function serializeRSAKey(key) {
	return JSON.stringify({
		coeff: key.coeff.toString(16),
		d: key.d.toString(16),
		dmp1: key.dmp1.toString(16),
		dmq1: key.dmq1.toString(16),
		e: key.e.toString(16),
		n: key.n.toString(16),
		p: key.p.toString(16),
		q: key.q.toString(16)
	});
}

function deserializeRSAKey(key) {
	let json = JSON.parse(key);
	let rsa = new RSAKey();
	rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);
	return rsa;
}

function splitter(str, l) {
    var strs = "";
    while(str.length > l){
        var pos = str.substring(0, l).lastIndexOf(' ');
        pos = pos <= 0 ? l : pos;
        strs += str.substring(0, pos) + "\n";
        var i = str.indexOf(' ', pos)+1;
        if(i < pos || i > pos+l)
            i = pos;
        str = str.substring(i);
    }
    strs += str;
    return strs;
}

function CSecret() {
	var keystring;
	var rsakey;
	
	this.save = function() {
		console.log("saving secert");
		
		var data = {};
		data.keystring = this.keystring;
		localStorage.setItem("secret", JSON.stringify(data));		
	}

	this.getPublicKey = function() {
		return cryptico.publicKeyString(this.rsakey);
	}

	this.load = function() {
		var jsonsecret = localStorage.getItem("secret");
			
		if(jsonsecret != null) {
			console.log("parsing secret " + jsonsecret)
			data = JSON.parse(jsonsecret);
			this.keystring = data.keystring;
			this.rsakey = deserializeRSAKey(this.keystring);
		}
		
		if(this.keystring==null) {
			// The passphrase used to repeatably generate this RSA key.
			var passphrase = Math.random().toString(36).slice(-8);
	
			// The length of the RSA key, in bits.
			var Bits = 1024; 
	
			this.rsakey = cryptico.generateRSAKey(passphrase, Bits);
			console.log("rsakey " + this.rsakey);
	
			this.keystring = serializeRSAKey(this.rsakey);	
	
			this.save();
		}
	}
	
	this.load();
};

function CIdentity() 
{
	var me = this;
	this.data = {};
	this.data.profile = {};
	this.data.profile.thumbnail = "image.png";
	this.data.profile.name = "default name " + Math.random();
	
	this.updatePublickey = function() {
		this.data.profile.publickeystring = secret.getPublicKey();
	}
	
	this.load = function() {	
		console.log("load identity");
		
		this.updatePublickey();
		
		this.data.profile.publickeystring = splitter(this.data.profile.publickeystring, 40);
		var identityid = this.getId();
		if(identityid!=null) {
			console.log("Loading stored IdentityId " + identityid);
			ipfs.files.cat(identityid, function(err, data) {
				console.log("load error " + err);
				console.log("files " + JSON.stringify(data));					
				console.log("data " + data.url);
				$.get(data.url, function(data) {
					console.log("data " + data);
					me.data.profile = JSON.parse(data);
					setIdentityData(me.data);
				});
			});
		} else {
			this.save();
			this.getId();
		}		
	}
	
	this.save = function() {
		console.log("save profile");
		var json = JSON.stringify(this.data.profile);
		console.log("profile : " + json);
		const buffer = Buffer.from(json);
		ipfs.files.add(buffer, function(err, files) {
			console.log("err " + err);
			localStorage.setItem(PARAM_IDENTITYID, files[0].hash); 
			console.log("stored profile with id " + me.getId());
			setIdentityData(me.data);
		});
	}
	
	this.getId = function() {
		var id =  localStorage.getItem(PARAM_IDENTITYID);
		this.data.identityid = id;
		return id;
	}
	
	this.load();
};

function setIdentityData(data) {
	console.log("set identity data");
	var identitytmpl = _.template($('#IdentityTemplate').html());
	$("#identity").append(identitytmpl(identity.data));
}	

var secret = new CSecret();
var identity = new CIdentity();

