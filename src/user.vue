<template>
	<div>
		<h1>User</h1>

		<div class="row">	
			<div v-if="loaded" class="col-sm-12">		
			    <img class="id-img" :src="pub.thumbnail" :alt="pub.name">
				<h1>{{ pub.name }}</h1>
			    <h2 class="id-publickey">ID</h2>
				<p>{{ profileid }}</p>
			
			    <h3 class="id-publickey">Public key</h3>
				<pre>{{ viewpublickeystring }}</pre>
			</div>
		</div>	
	</div>	
</template>

<script>
import {getProfile} from './modules/profile';

export default {
	data() {
		return getProfile(this.$route.params.userid).data;
	},
	methods: {
	}
}

</script>

// style
<style lang="stylus" scoped>
</style>
