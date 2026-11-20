import { watch, isRef } from 'vue';

export function useLocalStorage(cle, donnee) {
    try {
        const valeurSauvegardee = localStorage.getItem(cle);

        if (valeurSauvegardee !== null) {
            const valeur = JSON.parse(valeurSauvegardee);

            const valeurInitiale = isRef(donnee)
                ? donnee.value
                : donnee;

            const tableauInvalide =
                Array.isArray(valeurInitiale) && !Array.isArray(valeur);

            const nombreInvalide =
                typeof valeurInitiale === 'number' && !Number.isFinite(valeur);

            if (!tableauInvalide && !nombreInvalide) {
                if (isRef(donnee)) {
                    donnee.value = valeur;
                } else if (Array.isArray(donnee)) {
                    donnee.splice(0, donnee.length, ...valeur);
                }
            }
        }
    } catch (erreur) {
        console.error('Erreur de restauration :', erreur);
    }

    watch(donnee, (nouvelleValeur) => {
        try {
            localStorage.setItem(
                cle,
                JSON.stringify(nouvelleValeur)
            );
        } catch (erreur) {
            console.error('Erreur de sauvegarde :', erreur);
        }
    }, { deep: true });
}