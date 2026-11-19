<script setup>
const props = defineProps({
    id: { type: Number, required: true },
    libelle: { type: String, required: true },
    terminee: { type: Boolean, required: true },
    peutUtiliserTriManuel: { type: Boolean, required: true },
    peutMonter: { type: Boolean, required: true },
    peutDescendre: { type: Boolean, required: true }
});

const emit = defineEmits([
    'demanderSuppression',
    'demanderChangementStatut',
    'demanderMontee',
    'demanderDescente'
]);

function demanderSuppression() {
    emit('demanderSuppression', props.id);
}

function demanderChangementStatut() {
    emit('demanderChangementStatut', props.id);
}

function demanderMontee() {
    emit('demanderMontee', props.id);
}

function demanderDescente() {
    emit('demanderDescente', props.id);
}

</script>


<template>
    <li class="ligne-tache">
        <span class="libelle-tache"
              :class="{ terminee: props.terminee }">
            {{ props.libelle }}
        </span>

        <div class="actions-tache">
            <button
                type="button"
                @click="demanderMontee"
                :disabled="!props.peutUtiliserTriManuel || !props.peutMonter"
                class="btn-mini btn-monter"
            >
                ⬆
            </button>

            <button
                type="button"
                @click="demanderDescente"
                :disabled="!props.peutUtiliserTriManuel || !props.peutDescendre"
                class="btn-mini btn-descendre"
            >
                ⬇
            </button>

            <button
                type="button"
                @click="demanderChangementStatut"
                class="btn-mini btn-valider"
            >
                ✔
            </button>

            <button
                type="button"
                @click="demanderSuppression"
                class="btn-supprimer"
            >
                🗑 Supprimer
            </button>
        </div>
    </li>

</template>

<style scoped>
button {
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s ease;
  font-weight: 600;
}

button:disabled {
  background-color: #cbd5e1 !important;
  color: #64748b !important;
  cursor: not-allowed;
  opacity: 1;
  box-shadow: none;
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

@media (max-width: 768px) {
  .ligne-tache {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions-tache {
    width: 100%;
  }
}


</style>