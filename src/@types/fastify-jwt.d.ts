import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string; // este sub, representa o id do usuário
    };
  }
}
