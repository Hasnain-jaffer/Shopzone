/**
 * NoSQL-injection sanitizer.
 *
 * WHY not the `express-mongo-sanitize` package: it tries to reassign
 * `req.query` wholesale, but Express 5 made `req.query` a getter-only
 * property — that package throws `TypeError: Cannot set property query`
 * on literally every request that has a query string. This does the same
 * job (strip any key starting with '$' or containing '.', recursively)
 * but mutates objects *in place* instead of reassigning them, which works
 * on `req.body`, `req.params`, and `req.query` alike under Express 5.
 */

function stripDangerousKeys(obj) {
  if (obj === null || typeof obj !== 'object') return;

  if (Array.isArray(obj)) {
    obj.forEach(stripDangerousKeys);
    return;
  }

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }
    stripDangerousKeys(obj[key]);
  }
}

const sanitizeInput = (req, res, next) => {
  stripDangerousKeys(req.body);
  stripDangerousKeys(req.params);
  stripDangerousKeys(req.query);
  next();
};

export { sanitizeInput };
