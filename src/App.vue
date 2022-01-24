<template>
  <v-app row wrap>
    <v-main>
      <v-app-bar color="success" elevation="4">
        <div>
          <h1>Gateway-Device</h1>
        </div>
      </v-app-bar>
      <!-- Sizes your content based upon application components -->
      <!-- If using vue-router -->
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<style>
* {
  justify-content: center;
}
</style>
