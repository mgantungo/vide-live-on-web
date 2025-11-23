<!--pages/index.vue-->
<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" class="text-center">
        <div class="mb-8">
          <h1 class="text-h2 font-weight-bold mb-4">Welcome to StreamTV</h1>
          <p class="text-h5 text-medium-emphasis">Your premium video streaming experience</p>
        </div>
        <v-btn
          color="primary"
          size="x-large"
          prepend-icon="mdi-play"
          @click="navigateToTV"
        >
          Start Watching
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const router = useRouter()

const navigateToTV = () => {
  router.push('/tv')
}
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
