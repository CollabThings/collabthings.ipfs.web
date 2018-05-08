var cryptico = require("cryptico");
import {newProfile} from './profile';
import {isipfs} from './isipfs';

export {
	getIdentity,
	getSecret
};

var Buffer = require('buffer/').Buffer

var PARAM_IDENTITYID = "collabthings.identityid";
var PARAM_SECRET = "collabthings.secret";

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

function CSecret() {
	var keystring;
	var rsakey;
	this.data = {};

	this.save = function () {
		console.log("saving secert");

		this.data.keystring = this.keystring;
		localStorage.setItem(PARAM_SECRET, JSON.stringify(this.data));
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
	this.profile = newProfile();
	this.data.profile = this.profile.data;
	
	this.updatePublickey = function () {
		this.profile.data.pub.publickeystring = secret.getPublicKey();
	}

	this.load = function (callback) {
		console.log("load identity");

		this.updatePublickey();

		var identityid = this.getId();
		if (identityid != null) {
			console.log("Loading stored IdentityId " + identityid);
			var me = this;
			this.profile.load(identityid);
		} else {
			this.save();
			this.getId();
		}
	}

	this.save = function () {
		if(isipfs()) {
			var profile = this.profile;

			console.log("save profile");
						 
			var profilecopy = Vue.util.extend({}, profile.data.pub);
			
			var json = JSON.stringify(profilecopy);
			console.log("profile : " + json);
			const buffer = Buffer.from(json);
			ipfs.files.add(buffer, function (err, files) {
				console.log("err " + err);
				localStorage.setItem(PARAM_IDENTITYID, files[0].hash);
				console.log("stored profile with id " + me.getId());

				me.profile.update();
			});
		} else {
			console.log("Not connected to ipfs. Not saving.");
		}
	}

	this.getId = function () {
		var id = localStorage.getItem(PARAM_IDENTITYID);
		this.data.identityid = id;
		this.profile.data.profileid = id;
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