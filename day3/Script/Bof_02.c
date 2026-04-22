#include <stdio.h>

int main() {
    int vector[10];
    int *p = vector;
    int i = 0;
    int j, k, swap_var;
    char c;

    printf("Inserire interi (premi INVIO alla fine):\n");
    do {
        if (scanf("%d", (p + i)) == 1) {
            i++;
        }
        while ((c = getchar()) == ' ');
        if (c != '\n' && c != EOF) ungetc(c, stdin);
    } while (c != '\n' && c != EOF);

    printf("\nIl vettore inserito e':\n");
    for (j = 0; j < i; j++)
        printf("[%d]: %d\n", j + 1, vector[j]);

    for (j = 0; j < i - 1; j++)
        for (k = 0; k < i - j - 1; k++)
            if (vector[k] > vector[k + 1]) {
                swap_var = vector[k];
                vector[k] = vector[k + 1];
                vector[k + 1] = swap_var;
            }

    printf("\nIl vettore ordinato e':\n");
    for (j = 0; j < i; j++)
        printf("[%d]: %d\n", j + 1, vector[j]);

    return 0;
}