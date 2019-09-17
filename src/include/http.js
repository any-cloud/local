import Arena from "bull-arena";

const arena = Arena({
  queues: [
    {
      name: "only",
      hostId: "The Only Queue"
    }
  ]
});

export function http(app) {
  app.use(
    "/arena",
    function(req, res, next) {
      req.basepath = "/arena";
      res.locals.basepath = "/arena";
      next();
    },
    arena
  );

  return app;
}
