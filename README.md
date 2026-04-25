# Refactoring Guiado

> **Tipo:** REFACTORING · **Duración estimada:** 180 min · **Nivel:** Intermedio (requiere Git Workflow)

## Objetivo

Aplicar principios SRP y DRY para refactorizar un módulo legacy con CC elevada y duplicación, reduciendo el tamaño en ≥ 50 líneas sin romper los tests existentes.

## Instrucciones

### 1. Prepara tu entorno

```bash
git clone <url-de-tu-repositorio>
cd workshop-refactoring-basico/starter-code
pnpm install
pnpm test   # debe pasar antes de empezar
```

### 2. Estudia el código

Abre `src/report-generator.js` (≈ 200 líneas). Identifica:
- Funciones con CC > 10 (usa `npx complexity-report src/`)
- Bloques de código casi idénticos
- Funciones con más de una responsabilidad

### 3. Refactoriza sin cambiar comportamiento

Técnicas recomendadas:
- **Extract Function**: mueve lógica interna a funciones auxiliares más pequeñas
- **Replace Conditional with Polymorphism**: crea una tabla de datos en vez de if/else en cadena
- **DRY**: extrae bloques duplicados a funciones con parámetros

```bash
# Verifica constantemente que los tests siguen pasando
pnpm test
```

### 4. Verifica las métricas

```bash
pnpm lint              # 0 errores
npx complexity-report src/   # CC ≤ 10 en todas las funciones
```

### 5. Abre el Pull Request

El PR debe eliminar ≥ 50 líneas netas (`git diff --shortstat main`).

## Criterios de evaluación

| Métrica | Peso | Umbral |
|---|---|---|
| Complejidad ciclomática | 35% | CC promedio ≤ 10 |
| Duplicación de código | 35% | Duplicación ≤ 3% |
| Delta de líneas | 30% | PR elimina ≥ 50 líneas netas |

## Recursos

- [Refactoring Guru — Extract Function](https://refactoring.guru/extract-method)
- [Clean Code: Chapter 3 — Functions](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
