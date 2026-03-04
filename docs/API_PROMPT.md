# Template de Prompt para Criar uma Rota de API

Crie a rota `POST /workout-plans/{workoutPlanId(uuid)}/days/{workoutDayId(uuid)}/sessions`

## Descrição

Ela inicia uma sessão de treino de um dia de um plano de treino específico.

## Requisitos Técnicos

- Um dia iniciado representa uma WorkoutSession criada no banco de dados.
- Use case deve se chamar "StartWorkoutSession".
- A data/hora de início usa o momento atual da criação.

## Autenticação

- Rota protegida.
- Apenas o dono do plano de treino pode iniciar uma sessão de treino.

## Request

```ts
interface Body {}
```

```ts
interface Params {
  workoutPlanId: string;
  workoutDayId: string;
}
```

```ts
interface Query {}
```

## Response

```ts
interface StatusCode201 {
  workoutSessionId: string;
}
```

## Status Codes

- **201**: Sessão criada com sucesso
- **400**: Workout plan inativo ou workout day é rest day
- **401**: Usuário não autenticado
- **403**: Workout plan não pertence ao usuário
- **404**: Workout plan ou workout day não encontrado
- **409**: Sessão já iniciada para este day (startedAt presente)
- **500**: Erro interno do servidor

## Regras de Negócio

- Apenas o dono do workout plan pode iniciar a sessão de treino.
- O workout plan deve estar ativo (isActive = true).
- O workout day não pode ser um dia de descanso (isRest = false).
- Caso o dia recebido já tenha uma sessão iniciada (startedAt presente), retorne 409.
- Validar se o workout plan existe e pertence ao usuário autenticado.
- Validar se o workout day existe e pertence ao workout plan especificado.
