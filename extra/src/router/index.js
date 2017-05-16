import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello.vue'

import Main from '@/Main.vue'
import Test from '@/Test.vue'

import UploadPhoto from '@/pages/upload/photo.vue'

Vue.use(Router)

export default new Router({
	mode: 'history',
    routes: [
    	{ path: '/', redirect: '/main'},
	    {
	        path: '/main',
	        component: Main,
	        children: [
	        	{ path: '*', component: Hello}
	        ]
	    },
	    {
	    	path: '/test',
	    	component: Test,
	    	children: [
	    		{ path: 'upload/photo', component: UploadPhoto}
	    	]
	    }
    ]
})