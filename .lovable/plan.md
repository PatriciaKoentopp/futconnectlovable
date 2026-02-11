

# Corrigir parsing de data na pagina de aniversariantes

## Problema

No hook `useMemberBirthdaysFullYear.ts`, a linha 43 usa `new Date(member.birth_date)` que aplica conversao de timezone, causando datas incorretas.

## Solucao

Mesmo ajuste aplicado no hook de aniversariantes de clube: substituir `new Date()` pelo parsing direto da string `YYYY-MM-DD`.

## Arquivo a Modificar

**`src/hooks/useMemberBirthdaysFullYear.ts`** - Linhas 43-45

De:
```typescript
const date = new Date(member.birth_date);
const month = date.getMonth() + 1;
const day = date.getDate();
```

Para:
```typescript
const [, monthStr, dayStr] = member.birth_date.split('-');
const month = parseInt(monthStr, 10);
const day = parseInt(dayStr, 10);
```

