<script setup>
import { ref, onMounted, computed } from 'vue';

const visits = ref([]);
const loading = ref(true);
const error = ref(null);

// 1. Nuova variabile per quello che l'utente scrive nella barra
const searchQuery = ref('');

const fetchVisits = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/visits');
    if (!response.ok) throw new Error('Errore di connessione al server');
    visits.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 2. Filtro dinamico: Vue calcola questa lista in tempo reale mentre digiti!
const filteredVisits = computed(() => {
  if (!searchQuery.value) {
    return visits.value; // Se la barra è vuota, mostra tutto
  }
  
  const query = searchQuery.value.toLowerCase();
  return visits.value.filter(visit => 
    visit.mnemonicName.toLowerCase().includes(query) || 
    visit.generalLogistics.toLowerCase().includes(query)
  );
});

onMounted(() => {
  fetchVisits();
});
</script>

<template>
  <div class="home-wrapper">
    <h2 class="section-title">Visite Disponibili</h2>

    <div class="search-container">
      <input 
        type="text" 
        v-model="searchQuery" 
        class="search-input"
        placeholder="🔍 Cerca visita o luogo..."
      />
    </div>

    <div v-if="loading" class="status-msg">Caricamento... ⏳</div>
    <div v-else-if="error" class="status-msg error">⚠️ {{ error }}</div>
    <div v-else-if="visits.length === 0" class="status-msg empty">Nessuna visita nel database.</div>
    
    <div v-else-if="filteredVisits.length === 0" class="status-msg empty">
      Nessun risultato per "{{ searchQuery }}"
    </div>

    <div v-else class="cards-container">
      <div v-for="visit in filteredVisits" :key="visit._id" class="visit-card">
        
        <div class="card-header">
          <h3>{{ visit.mnemonicName }}</h3>
        </div>
        
        <div class="card-body">
          <span class="icon">📍</span>
          <p>{{ visit.generalLogistics }}</p>
        </div>
        
        <button class="btn-dettagli">Scopri di più</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 600;
}

/* Stile per la nuova barra di ricerca */
.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #dcdde1;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #ffffff;
  color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.status-msg {
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
  font-size: 0.95rem;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.visit-card {
  background: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.visit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.06);
}

.card-header h3 {
  margin: 0 0 12px 0;
  font-size: 1.15rem;
  color: #34495e;
}

.card-body {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
}

.card-body p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.95rem;
  line-height: 1.4;
}

.btn-dettagli {
  width: 100%;
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-dettagli:hover {
  background-color: #e2e8f0;
  color: #1a202c;
}
</style>