<script setup>
import { ref, useTemplateRef, onMounted, onUnmounted } from 'vue';
const nouvelleTache = ref('');
const champSaisie = useTemplateRef('champSaisie');

const emit = defineEmits(['demanderAjoutTache']);



function gererSoumission() {
    const libelle = nouvelleTache.value.trim();

    if (!libelle) {
        return;
    }

    emit('demanderAjoutTache', libelle);

    nouvelleTache.value = '';
}

function gererRaccourciClavier(event) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
    }

    if (event.target.matches('input, textarea') ||
        event.target.isContentEditable) {
        return;
    }

    if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        champSaisie.value.focus();
    }

  }

  onMounted(() => {
    champSaisie.value.focus();
    window.addEventListener('keydown', gererRaccourciClavier);
});

onUnmounted(() => {
    window.removeEventListener('keydown', gererRaccourciClavier);
});

</script>

<template>
  <form @submit.prevent="gererSoumission" class="form-ajout">
        <input
            ref="champSaisie"
            type="text"
            v-model="nouvelleTache"
            placeholder="Entrez une nouvelle tâche"
        >

        <button
            type="submit"
            :disabled="nouvelleTache.trim() === ''"
            class="btn-ajouter"
        >
            Ajouter
        </button>
    </form>
</template>

<style scoped>
.form-ajout {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  margin-bottom: 30px;
}

input {
  flex: 1;
  min-width: 0;
  padding: 16px 18px;
  border: 2px solid #cbd5e1;
  border-radius: 12px;
  font-size: 17px;
  background-color: #f8fafc;
  color: #1e293b;
}

input:focus {
  outline: none;
  border-color: #4f46e5;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15);
}

button {
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s ease;
  font-weight: 600;
}

.btn-ajouter {
  padding: 15px 20px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  min-width: 140px;
}

.btn-ajouter:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(79, 70, 229, 0.25);
}

button:disabled {
  background-color: #cbd5e1 !important;
  color: #64748b !important;
  cursor: not-allowed;
  opacity: 1;
  box-shadow: none;
}

.btn-ajouter:disabled {
  background-color: #a5b4fc;
  color: #ffffff !important;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-ajout {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-ajouter {
    width: 100%;
  }
}
</style>