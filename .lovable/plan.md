
# Plano: Filtrar Apenas Jogos Realizados nos Alertas de Ausência

## Problema Identificado

Na página `/game-absence-alerts`, ao buscar os jogos anteriores para calcular as faltas consecutivas, a query não filtra pelo status do jogo. Isso faz com que jogos cancelados sejam considerados como ausências, gerando alertas incorretos.

## Arquivo a Alterar

`src/pages/GameAbsenceAlerts.tsx`

## Alteração Necessária

**Linhas 89-99** - Adicionar filtro de status 'completed' na busca de jogos anteriores:

**Codigo Atual:**
```typescript
const { data: previousGames } = await supabase
  .from('games')
  .select(`
    id,
    date,
    game_participants!inner(status)
  `)
  .eq('club_id', user.activeClub.id)
  .eq('game_participants.member_id', absence.member_id)
  .lt('date', lastGame.date)
  .order('date', { ascending: false });
```

**Codigo Corrigido:**
```typescript
const { data: previousGames } = await supabase
  .from('games')
  .select(`
    id,
    date,
    game_participants!inner(status)
  `)
  .eq('club_id', user.activeClub.id)
  .eq('status', 'completed')
  .eq('game_participants.member_id', absence.member_id)
  .lt('date', lastGame.date)
  .order('date', { ascending: false });
```

## Explicacao Tecnica

- A linha `.eq('status', 'completed')` garante que apenas jogos realizados sejam considerados
- Jogos cancelados (`status = 'canceled'`) e agendados (`status = 'scheduled'`) serao ignorados
- A busca inicial (linhas 30-36) ja filtra corretamente, esta alteracao corrige a busca de jogos anteriores

## Resultado Esperado

- Somente jogos com status "realizado" serao considerados para calculo de ausencias
- Jogos cancelados nao contarao como falta para nenhum socio
- O calculo de faltas consecutivas sera mais preciso e justo
