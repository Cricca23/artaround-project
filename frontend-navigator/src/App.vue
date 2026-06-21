<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>ArtAround</h1>
      <p>Navigator</p>
    </header>
    
    <main class="app-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-header {
  background-color: #2c3e50; /* Blu scuro elegante */
  color: #ffffff;
  padding: 20px;
  text-align: center;
  border-bottom: 4px solid #42b883; /* Il tocco di verde Vue, ma sottile */
}

.app-header h1 {
  font-size: 1.8rem;
  margin: 0;
  letter-spacing: 1px;
}

.app-header p {
  margin: 0;
  font-size: 0.85rem;
  color: #42b883;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.app-content {
  padding: 20px;
}
</style>