<template>
  <div class="home">
    <Gateway/>
  </div>
</template>

<script>
// @ is an alias to /src
import Gateway from '@/components/Gateway.vue'

export default {
  name: 'Home',
  components: {
    Gateway
  }
}
</script>
