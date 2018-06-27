<template>
  <div>
      <Home :status="'profile'"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Home from '@/components/mainComponents/Home.vue'

export default {
  name: 'home',
  components: {
    Home
  }
}
</script>
