<template>
	<div>
		<div class="row">
			<div class="col-sm-12">
				<h2>Identity</h2>
				
				<form id="profile">
				  <div class="form-group">
				    <label class="control-label col-sm-2" >Username:</label>
				    <input v-model="profile.name" type="text"  />
				  </div>
				  <button v-on:click="apply">Apply</button>
				</form>
			</div>
		</div>
		
		<div class="row">	
			<div class="col-sm-12">		
			    <img class="id-img" :src="profile.thumbnail" :alt="profile.name">
				<h1>{{ profile.name }}</h1>
			    <h2 class="id-publickey">Your ID</h2>
				<p>{{ identityid }}</p>
			
			    <h3 class="id-publickey">Your public key</h3>
				<pre>{{ viewpublickeystring }}</pre>
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
			console.log("profile name " + getIdentity().save());
		}
	}
}

</script>

<style>

</style>
