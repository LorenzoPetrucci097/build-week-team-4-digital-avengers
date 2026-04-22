#include <stdio.h>

void corretto(void);
void vulnerabile(void);

int main() {
    int scelta = 0;
    while (scelta != 3) {
        printf("\nScegli tra queste tre opzioni: \n");
        printf("(1) Esegui programma CORRETTO (Input validato)\n");
        printf("(2) Esegui programa VULNERABILE (Provoca Segmentation Fault)\n");
        printf("(3) Exit. \n");
        printf("Opzione: ");
        
        scanf("%d", &scelta);
        if (scelta == 1) {
            corretto();
        } else if (scelta == 2) {
            vulnerabile();
        } else if (scelta == 3) {
            printf("Hai scelto Exit. Arrivederci!\n");
        } else {
            printf("Opzione non valida!\n");
        }
    }
    return 0;
}

//  VERSIONE CORRETTA
void corretto(void) {
    int vector[10], i, j, k;
    int swap_var;

    printf("\n--- PROGRAMMA CORRETTO ---\n");
    printf("Inserire 10 interi:\n");

    for (i = 0; i < 10; i++) {
        printf("[%d]: ", i + 1);
        while (scanf("%d", &vector[i]) != 1) {
            printf("Errore: inserire un numero intero!\n");
            printf("[%d]: ", i + 1);
            while (getchar() != '\n');
        }
    }

    printf("\nIl vettore inserito e':\n");
    for (i = 0; i < 5; i++) {
        printf("[%d]: %-5d\t[%d]: %-5d\n", i + 1, vector[i], i + 6, vector[i + 5]);
    }

    for (j = 0; j < 9; j++)
        for (k = 0; k < 9 - j; k++)
            if (vector[k] > vector[k + 1]) {
                swap_var = vector[k];
                vector[k] = vector[k + 1];
                vector[k + 1] = swap_var;
            }

    printf("\nIl vettore ordinato e':\n");
    for (j = 0; j < 5; j++) {
        printf("[%d]: %-5d\t[%d]: %-5d\n", j + 1, vector[j], j + 6, vector[j + 5]);
    }
    printf("\n");
}

//  VERSIONE VULNERABILE 
void vulnerabile(void) {
    int vector[10]; 
    int *p = vector;
    int i = 0;
    int j, k, swap_var; 
    char c;

    printf("\n[VULNERABILE] \n Imetti una lunga riga di numeri e premi INVIO:\n");

    do {
        if (scanf("%d", (p + i)) == 1) {
            i++; 
        }
        while ((c = getchar()) == ' '); 
        if (c != '\n' && c != EOF) ungetc(c, stdin); 
    } while (c != '\n' && c != EOF);

    printf("\nHai inserito %d numeri in un'area da 10.\n", i);
    printf("Tentativo di ritorno al menu principale...\n");

    // BUBBLE SORT
    for (j = 0; j < i - 1; j++) {
        for (k = 0; k < i - j - 1; k++) {
            if (vector[k] > vector[k + 1]) {
                swap_var = vector[k];
                vector[k] = vector[k + 1];
                vector[k + 1] = swap_var;
            }
        }
    }

    printf("Vettore elaborato: ");
    for (j = 0; j < i; j++) printf("%d ", vector[j]);
    printf("\n");

    return; 
}