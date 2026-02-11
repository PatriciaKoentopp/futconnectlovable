
# Plano: Corrigir parsing de data na pagina de aniversariantes de clube

## Problema

No hook `useMemberClubAnniversariesFullYear.ts`, a linha 49 usa `new Date(member.registration_date)` que aplica conversao de timezone, causando datas incorretas (ex: `2025-04-15` pode virar dia 14 em timezones negativas).

## Solucao

Substituir `new Date()` pelo parsing direto da string `YYYY-MM-DD`, extraindo ano, mes e dia sem conversao de timezone. O projeto ja possui a funcao `parseExactDate` em `src/lib/utils.ts`, mas como so precisamos dos componentes numericos, basta fazer split da string.

## Arquivo a Modificar

**`src/hooks/useMemberClubAnniversariesFullYear.ts`** - Linhas 48-52

De:
```typescript
const date = new Date(member.registration_date);
const month = date.getMonth() + 1;
const day = date.getDate();
const registrationYear = date.getFullYear();
```

Para:
```typescript
const [yearStr, monthStr, dayStr] = member.registration_date.split('-');
const day = parseInt(dayStr, 10);
const month = parseInt(monthStr, 10);
const registrationYear = parseInt(yearStr, 10);
```

Isso extrai os valores diretamente da string `YYYY-MM-DD` sem nenhuma conversao de timezone.
