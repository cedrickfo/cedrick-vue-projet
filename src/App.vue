<script setup>
import { ref,   } from 'vue';
import TodoList from './components/TodoList.vue';
import TodoForm from './components/TodoForm.vue';
import { useLocalStorage } from './composables/useLocalStorage.js';
import { useTodolistStats } from './composables/useTodolistStats.js';
import { useTodolistTri } from './composables/useTodolistTri.js';
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

const {
    nombreTotalTaches,
    nombreTachesTerminees,
    aDesTaches
} = useTodolistStats(taches);

  


const triCritere = ref('manuel');

const {
    peutUtiliserTriManuel,
    tachesTriees
} = useTodolistTri(taches, triCritere);

const afficherFormulaire = ref(true);
const prochainId = ref(4);
const CLE_LOCALSTORAGE_TACHES = 'todolist:taches';
const CLE_LOCALSTORAGE_PROCHAIN_ID = 'todolist:prochainId';


useLocalStorage(CLE_LOCALSTORAGE_TACHES, taches);

useLocalStorage(CLE_LOCALSTORAGE_PROCHAIN_ID, prochainId);






function ajouterTache(libelle) {
  if (libelle.trim() === '') {
    return;
  }

  const tache = {
    id: prochainId.value,
    libelle: libelle,
    terminee: false,
    ordre: prochainId.value
  };

  taches.value.push(tache);

  prochainId.value++;
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


    <button @click="afficherFormulaire = !afficherFormulaire">
    {{ afficherFormulaire ? 'Masquer le formulaire' : 'Afficher le formulaire' }}
</button>

    <TodoForm
    v-if="afficherFormulaire"
    @demander-ajout-tache="ajouterTache"
/>

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
    <TodoList
        v-if="aDesTaches"
        :taches="tachesTriees"
        :peut-utiliser-tri-manuel="peutUtiliserTriManuel"
        @demander-suppression="supprimerTache"
        @demander-changement-statut="basculerTerminee"
        @demander-montee="monter"
        @demander-descente="descendre"
    />

    <p v-else class="message-vide">
        Aucune tâche à afficher
    </p>
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

.message-vide {
  text-align: center;
  padding: 25px;
  background-color: #f8fafc;
  border-radius: 12px;
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
}
</style>