<template>
	<div>
		<div class="row">
			<div class="col-sm-12">
				<h2>Identity</h2>
				
				<form id="profile">
				  <div class="form-group">
				    <label class="control-label col-sm-2" >Username:</label>
				    <input v-model="profile.pub.name" type="text"  />
				  </div>
				  <div class="form-group">
				    <label class="control-label col-sm-2" >Image URL:</label>
				    <input v-model="profile.pub.thumbnail" type="text"  />
				  </div>
				  <button v-on:click="apply">Apply</button>
				</form>
			</div>
		</div>
		
		<div class="row">	
			<div v-if="profile.loaded" class="col-sm-12">		
			    <img class="id-img" :src="profile.pub.thumbnail" >
				<h1>{{ profile.pub.name }}</h1>
			    <h2 class="id-publickey">Your ID</h2>
				<p>{{ identityid }}</p>
				<a :href="profile.link">Profile link</a> 			
			    <h3 class="id-publickey">Your public key</h3>
				<pre>{{ profile.viewpublickeystring }}</pre>

			</div>
		</div>	
	</div>	
</template>

<script>
import {getIdentity, getSecret} from './modules/identity';

export default {
	data() {
		return getIdentity().data;
	},
	methods: {
		apply: function(e) {
			console.log("got e " + e);
			getIdentity().save();
		}
	}
}

</script>

<style>

</style>
