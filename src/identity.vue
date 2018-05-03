<template>
	<div>
		<h2>Identity</h2>
		
		<p>
			Profile name {{ profile.name }}
		
		    <img class="id-img" :src="profile.thumbnail" :alt="profile.name">
			<h1>{{ profile.name }}</h1>
		    <h2 class="id-publickey">Your ID</h2>
			<p>{{ identityid }}</p>
		
		    <h3 class="id-publickey">Your public key</h3>
			<pre>{{ viewpublickeystring }}</pre>
		</p>
	</div>	
</template>

<script>
import {getIdentity, getSecret} from './modules/identity';

export default {
	data() {
		return getIdentity().data;
	}
}

</script>

<style>

</style>
