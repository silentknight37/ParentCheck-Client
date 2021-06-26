export default function createLink(path, parameters) {
  let route = path;

  if (parameters) {
    Object.keys(parameters).forEach(key => {
      route = route.replace(`:${key}`, parameters[key]);
    });
  }

  return route;
}
