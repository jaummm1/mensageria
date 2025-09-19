# NestJS Reservas - Demo

Projeto mínimo em NestJS que implementa os requisitos descritos:
- Consumer simples que lê mensagens JSON de `src/messages/*.json` e persiste em um banco relacional (SQLite via TypeORM).
- Tabelas mínimas: cliente, reserva, quarto, reservado.
- Registra `indexed_at` no momento da indexação.
- Rota HTTP GET /reserves com filtros: uuid, clientId, roomId, hotelId.
- Computa `total_value` da reserva e `total_value` por quarto.

Como usar:
1. `npm install`
2. `npm run start:dev`
3. Copie arquivos JSON para `src/messages/` ou use o `src/messages/sample1.json`. 
   Ao iniciar a aplicação o Consumer tentará processar os arquivos e gravar em `data/reservas.sqlite`.
4. GET http://localhost:3000/reserves

Observações:
- Este projeto usa SQLite para facilitar execução sem dependências externas.
- O "consumer" é baseado em leitura de arquivos para facilitar demo offline; você pode adaptar para Kafka/Rabbit/etc.
