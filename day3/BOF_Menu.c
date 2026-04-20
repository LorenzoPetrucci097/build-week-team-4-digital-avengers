#include <stdio.h>
#include <stdlib.h>

void esegui_programma(int vulnerabile) {
    int vector[10];
    int i, j, k, swap_var, limite;

    // Se vulnerabile è 1, scriviamo oltre il limite (20), altrimenti ci fermiamo a 10
    limite = vulnerabile ? 20 : 10;

    printf("\n--- Modalita': %s ---\n", vulnerabile ? "VULNERABILE (BOF)" : "SICURA");
    printf("Inserire i numeri:\n");

    for (i = 0; i < limite; i++) {
        printf("[%d]: ", i + 1);
        // Il buffer overflow avviene qui se i > 9
        if (scanf("%d", &vector[i]) != 1) break; 
    }

    // Ordinamento Bubble Sort (solo per i primi 10 elementi per evitare crash immediati qui)
    for (j = 0; j < 9; j++) {
        for (k = 0; k < 9 - j; k++) {
            if (vector[k] > vector[k + 1]) {
                swap_var = vector[k];
                vector[k] = vector[k + 1];
                vector[k + 1] = swap_var;
            }
        }
    }

    printf("\nRisultato ordinamento (primi 10): \n");
    for (j = 0; j < 10; j++) printf("[%d]: %d\n", j + 1, vector[j]);
}

int main() {
    int scelta;

    printf("=== Laboratorio System Exploit BOF ===\n");
    printf("1. Esegui programma CORRETTO (Input validato)\n");
    printf("2. Esegui programma VULNERABILE (Provoca Segmentation Fault)\n");
    printf("Scelta: ");
    scanf("%d", &scelta);

    if (scelta == 1) {
        esegui_programma(0);
    } else if (scelta == 2) {
        esegui_programma(1);
    } else {
        printf("Scelta non valida.\n");
    }

    return 0;
}