<script setup>
import { ref, computed, watch } from 'vue';

const taches = ref([
                   
                   {id:1,
                   libelle: 'apprendre vue.js',
                   terminee: false,
                   ordre: 1},


                   {
                      id: 2,
                      libelle: 'faire les exercices',
                      terminee: false,
                      ordre: 2

                   },

                   {
                     id:3,
                     libelle: 'reserver le cours',
                     terminee: false,
                     ordre: 3


                   }
])

const nombreTotalTaches = computed(() => {
  return taches.value.length;
});

const nombreTachesTerminees = computed(() => {
  return taches.value.filter(t => t.terminee).length;
});

const aDesTaches = computed(() => {
  return taches.value.length > 0;
});

const peutUtiliserTriManuel = computed(() => {
  return triCritere.value === 'manuel';
});

const tachesTriees = computed(() => {
  switch (triCritere.value) {
    case 'manuel':
      return taches.value.toSorted((a, b) => a.ordre - b.ordre);

    case 'creation':
      return taches.value.toSorted((a, b) => a.id - b.id);

    case 'libelleAsc':
      return taches.value.toSorted((a, b) =>
        a.libelle.localeCompare(b.libelle)
      );

    case 'libelleDesc':
      return taches.value.toSorted((a, b) =>
        b.libelle.localeCompare(a.libelle)
      );

    case 'terminee':
      return taches.value.toSorted((a, b) =>
        Number(a.terminee) - Number(b.terminee) ||
        a.libelle.localeCompare(b.libelle)
      );

    default:
      return taches.value.toSorted((a, b) => a.ordre - b.ordre);
  }
});

const nouvelleTache = ref ('');
const triCritere = ref('manuel');
const prochainId = ref(4);
const CLE_LOCALSTORAGE_TACHES = 'todolist:taches';
const CLE_LOCALSTORAGE_PROCHAIN_ID = 'todolist:prochainId';


const tachesSauvegardees = localStorage.getItem(CLE_LOCALSTORAGE_TACHES);

if (tachesSauvegardees !== null) {
  taches.value = JSON.parse(tachesSauvegardees);
}

const idSauvegarde = localStorage.getItem(CLE_LOCALSTORAGE_PROCHAIN_ID);

if (idSauvegarde !== null) {
  prochainId.value = Number(idSauvegarde);
}

watch(taches, () => {
  localStorage.setItem(
    CLE_LOCALSTORAGE_TACHES,
    JSON.stringify(taches.value)
  );
}, { deep: true });

watch(prochainId, (nouvelleValeur) => {
  localStorage.setItem(
    CLE_LOCALSTORAGE_PROCHAIN_ID,
    String(nouvelleValeur)
  );
});




function ajouterTache() {
  if (nouvelleTache.value.trim() === '') {
    return;
  }

  const tache = {
    id: prochainId.value,
    libelle: nouvelleTache.value,
    terminee: false,
    ordre: prochainId.value
  };

  taches.value.push(tache);

  prochainId.value++;

  nouvelleTache.value = '';

}

function basculerTerminee(id) {
  const tache = taches.value.find(t => t.id === id);

  if (tache) {
    tache.terminee = !tache.terminee;
  
  }
}

function supprimerTache(id) {
  taches.value = taches.value.filter(t => t.id !== id);


}

function monter(id) {
  if (!peutUtiliserTriManuel.value) {
    return;
  }

  const index = tachesTriees.value.findIndex(t => t.id === id);

  if (index <= 0) {
    return;
  }

  const tacheActuelle = taches.value.find(t => t.id === id);

  const tachePrecedente = taches.value.find(
    t => t.id === tachesTriees.value[index - 1].id
  );

  const ancienOrdre = tacheActuelle.ordre;

  tacheActuelle.ordre = tachePrecedente.ordre;
  tachePrecedente.ordre = ancienOrdre;


}

function descendre(id) {
  if (!peutUtiliserTriManuel.value) {
    return;
  }

  const index = tachesTriees.value.findIndex(t => t.id === id);

  if (index === -1 || index >= tachesTriees.value.length - 1) {
    return;
  }

  const tacheActuelle = taches.value.find(t => t.id === id);

  const tacheSuivante = taches.value.find(
    t => t.id === tachesTriees.value[index + 1].id
  );

  const ancienOrdre = tacheActuelle.ordre;

  tacheActuelle.ordre = tacheSuivante.ordre;
  tacheSuivante.ordre = ancienOrdre;


}


</script>


<template>
  <div id="conteneur">
    <h2>Exo Synthèse</h2>

    <form @submit.prevent="ajouterTache" class="form-ajout">
      <input
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

    <div class="bloc-tri">
      <label for="tri">Trier les tâches :</label>

      <select
        id="tri"
        v-model="triCritere"
      >
        <option value="manuel">Ordre personnalisé</option>
        <option value="creation">Ordre de création</option>
        <option value="libelleAsc">Libellé A → Z</option>
        <option value="libelleDesc">Libellé Z → A</option>
        <option value="terminee">Non terminées d'abord</option>
      </select>

    </div>

    <p class="info-tri">
      Les flèches ⬆ et ⬇ fonctionnent uniquement avec le tri
      "Ordre personnalisé".
    </p>

    <div class="compteurs">
      <div class="compteur compteur-total">
        <span class="compteur-titre">Total</span>
        <span class="compteur-valeur">{{ nombreTotalTaches }}</span>
      </div>

      <div class="compteur compteur-terminees">
        <span class="compteur-titre">Terminées</span>
        <span class="compteur-valeur">
          {{ nombreTachesTerminees }}
        </span>
      </div>
    </div>

    <div class="zone-liste">
      <ul v-if="aDesTaches" class="liste-taches">
        <li v-for="tache in tachesTriees" :key="tache.id" class="ligne-tache">
          <span class="libelle-tache" :class="{ terminee: tache.terminee }">
            {{ tache.libelle }}
          </span>

          <div class="actions-tache">
            <button
              type="button"
              @click="monter(tache.id)"
              :disabled="!peutUtiliserTriManuel"
              class="btn-mini btn-monter"
            >
              ⬆
            </button>

            <button
              type="button"
              @click="descendre(tache.id)"
              :disabled="!peutUtiliserTriManuel"
              class="btn-mini btn-descendre"
            >
              ⬇
            </button>

            <button
              type="button"
              @click="basculerTerminee(tache.id)"
              class="btn-mini btn-valider"
            >
              ✔
            </button>

            <button
              type="button"
              @click="supprimerTache(tache.id)"
              class="btn-supprimer"
            >
              🗑 Supprimer
            </button>
          </div>
        </li>
      </ul>

      <p v-else class="message-vide">Aucune tâche à afficher</p>
    </div>
  </div>
</template>





<style scoped>
#conteneur {
  background: #ffffff;
  padding: 35px;
  border-radius: 22px;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.12);
  min-height: 75vh;
}

h2 {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 30px;
  color: #4338ca;
  font-weight: 800;
}

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

.bloc-tri {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}

label {
  font-weight: 600;
  color: #334155;
}

select {
  padding: 12px 14px;
  border: 2px solid #cbd5e1;
  border-radius: 10px;
  background-color: #f8fafc;
  font-size: 15px;
  color: #1e293b;
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

.btn-appliquer {
  padding: 12px 18px;
  background-color: #0f766e;
  color: white;
}

.btn-appliquer:hover:not(:disabled) {
  background-color: #115e59;
}

button:disabled {
  background-color: #cbd5e1 !important;
  color: #64748b !important;
  cursor: not-allowed;
  opacity: 1;
  box-shadow: none;
}

.info-tri {
  background-color: #eef2ff;
  border-left: 5px solid #4f46e5;
  padding: 14px 16px;
  border-radius: 10px;
  color: #3730a3;
  margin-bottom: 25px;
  font-size: 15px;
}

.compteurs {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.compteur {
  flex: 1;
  min-width: 220px;
  padding: 20px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.compteur-total {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1d4ed8;
}

.compteur-terminees {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #15803d;
}

.compteur-titre {
  font-size: 15px;
  font-weight: 700;
}

.compteur-valeur {
  font-size: 2rem;
  font-weight: 800;
}

.zone-liste {
  margin-top: 10px;
}

.liste-taches {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ligne-tache {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 16px 18px;
  margin-bottom: 14px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
}

.libelle-tache {
  font-size: 17px;
  font-weight: 500;
  color: #1e293b;
  word-break: break-word;
}

.actions-tache {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-mini {
  padding: 10px 14px;
  color: white;
}

.btn-monter,
.btn-descendre {
  background-color: #6366f1;
}

.btn-monter:hover:not(:disabled),
.btn-descendre:hover:not(:disabled) {
  background-color: #4338ca;
}

.btn-valider {
  background-color: #16a34a;
}

.btn-ajouter:disabled {
  background-color: #a5b4fc;
  color: #ffffff !important;
  cursor: not-allowed;
}

.btn-valider:hover:not(:disabled) {
  background-color: #15803d;
}

.btn-supprimer {
  padding: 10px 16px;
  background-color: #dc2626;
  color: white;
}

.btn-supprimer:hover:not(:disabled) {
  background-color: #b91c1c;
}

.terminee {
  text-decoration: line-through;
  color: #94a3b8;
}

.message-vide {
  text-align: center;
  padding: 25px;
  background-color: #f8fafc;
  border-radius: 14px;
  color: #64748b;
  font-size: 17px;
  font-weight: 600;
}

@media (max-width: 768px) {
  #conteneur {
    padding: 20px;
  }

  h2 {
    font-size: 2.2rem;
  }

  .form-ajout {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-ajouter {
    width: 100%;
  }

  .ligne-tache {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions-tache {
    width: 100%;
  }
}
</style>