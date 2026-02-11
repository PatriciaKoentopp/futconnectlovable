

# Corrigir estatisticas mostrando informacao aleatoria sem formacao de times

## Problema

Na pagina `/games`, ao clicar em "Ver Estatisticas" para um jogo que nao teve formacao de times, o modal divide os jogadores confirmados ao meio e os distribui aleatoriamente em dois times (linhas 149-186 do `GameStatisticsModal.tsx`). Isso mostra informacao falsa ao usuario.

## Solucao

Quando nao houver formacao de times ativa para o jogo, exibir uma mensagem informativa no modal indicando que os times ainda nao foram formados, em vez de gerar times aleatorios. O modal continuara exibindo os eventos (gols, defesas) ja registrados, mas sem a divisao ficticia por times.

## Arquivo a Modificar

**`src/components/GameStatisticsModal.tsx`**

### Alteracao 1: Bloco sem formacao de times (linhas 149-186)

Quando `teamFormations` estiver vazio, em vez de dividir jogadores ao meio:
- Definir `teamPlayers` como objeto vazio `{}`
- Definir `activeTeams` como array vazio `[]`
- Adicionar um estado `hasTeamFormation` (boolean) para controlar se ha formacao

### Alteracao 2: Renderizacao condicional no modal

Onde o modal renderiza as colunas de times e placar:
- Se `hasTeamFormation` for `false`, exibir uma mensagem: "Os times ainda nao foram formados para este jogo. Forme os times para ver as estatisticas detalhadas."
- Se `hasTeamFormation` for `true`, manter o comportamento atual

### Detalhes tecnicos

```typescript
// Novo estado
const [hasTeamFormation, setHasTeamFormation] = useState(false);

// No bloco else (sem formacao):
} else {
  setTeamPlayers({});
  setHasTeamFormation(false);
  activeTeams = [];
}

// No bloco com formacao:
if (teamFormations && teamFormations.length > 0) {
  setHasTeamFormation(true);
  // ... codigo existente
}
```

Na renderizacao, envolver a secao de times/placar com a condicional:

```typescript
{!hasTeamFormation ? (
  <div className="text-center py-8 text-muted-foreground">
    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
    <p className="font-medium">Times nao formados</p>
    <p className="text-sm">Forme os times para ver as estatisticas detalhadas.</p>
  </div>
) : (
  // ... renderizacao atual dos times e placar
)}
```

