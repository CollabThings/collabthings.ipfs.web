var cryptico = require("cryptico");

export {
	getIdentity,
	getSecret
};
var Buffer = require('buffer/').Buffer

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
	
	let rsa = new cryptico.RSAKey();
	rsa.setPrivateEx(json.n, json.e, json.d, json.p, json.q, json.dmp1, json.dmq1, json.coeff);
	return rsa;
}

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

function CSecret() {
	var keystring;
	var rsakey;
	this.data = {};

	this.save = function () {
		console.log("saving secert");

		this.data.keystring = this.keystring;
		localStorage.setItem("secret", JSON.stringify(this.data));
	}

	this.getPublicKey = function () {
		return cryptico.publicKeyString(this.rsakey);
	}

	this.load = function () {
		var jsonsecret = localStorage.getItem("secret");

		if (jsonsecret != null) {
			console.log("parsing secret " + jsonsecret)
			this.data = JSON.parse(jsonsecret);
			keystring = this.data.keystring;
			rsakey = deserializeRSAKey(keystring);
		}

		if (this.keystring == null) {
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

function CIdentity() {
	var me = this;
	this.data = {};
	this.data.profile = {};
	this.data.profile.thumbnail = "image.png";
	this.data.profile.name = "default name " + Math.random();
	this.data.profile.publickeystring = "";
	this.data.viewpublickeystring = "public key";
	
	this.updatePublickey = function () {
		this.data.profile.publickeystring = secret.getPublicKey();
	}

	this.load = function (callback) {
		console.log("load identity");

		this.updatePublickey();

		var identityid = this.getId();
		if (identityid != null) {
			console.log("Loading stored IdentityId " + identityid);
			var me = this;
			ipfs.files.cat(identityid, function (err, iddata) {
				var idurl;

				if (err == null) {
					var profilecontent = iddata.toString('utf8');
					me.parseData(profilecontent);
				} else {
					idurl = "http://ipfs.io/ipfs/" + identityid;
					console.log("loading profile url " + idurl);
					$.get(idurl, function (profiledata) {
						me.parseData(profiledata);
					});
				}
			});
		} else {
			this.save();
			this.getId();
		}
	}

	this.parseData = function (profilecontent) {
		console.log("data content " + profilecontent);
		this.data.profile = JSON.parse(profilecontent);
		this.data.viewpublickeystring = splitter(this.data.profile.publickeystring, 40);
		this.data.profile.publickeystring = this.data.profile.publickeystring.replace(/\\n/g, "");
	}

	this.save = function () {
		console.log("save profile");
		var json = JSON.stringify(this.data.profile);
		console.log("profile : " + json);
		const buffer = Buffer.from(json);
		ipfs.files.add(buffer, function (err, files) {
			console.log("err " + err);
			localStorage.setItem(PARAM_IDENTITYID, files[0].hash);
			console.log("stored profile with id " + me.getId());
		});
	}

	this.getId = function () {
		var id = localStorage.getItem(PARAM_IDENTITYID);
		this.data.identityid = id;
		return id;
	}

	this.load();
};

function identityData() {
	return identity.data;
}

var secret = new CSecret();
var identity = new CIdentity();

function getIdentity() {
	console.log("identity data " + JSON.stringify(identity.data));
	return identity;
}

function getSecret() {
	return secret;
}