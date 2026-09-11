// Encaminha rejeições de handlers async para o error handler do Express.
export default (handler) => (request, response, next) =>
  Promise.resolve(handler(request, response, next)).catch(next);
