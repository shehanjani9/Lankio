// Local stand-in for the Resend API, used only by the test suite.
// The app is started with RESEND_BASE_URL pointing here, so contact-form
// tests exercise the real route and SDK without sending any email.
//
//   POST /emails      record the email, respond according to the mode
//   GET  /__sent      list recorded emails
//   POST /__reset     clear recorded emails and set mode to "ok"
//   POST /__mode      { "mode": "ok" | "fail" | "flaky" }
//                     fail  -> every send returns 500
//                     flaky -> the next send returns 500, then back to ok
import { createServer } from 'node:http';

const port = Number(process.env.MOCK_RESEND_PORT || 3901);
let sent = [];
let mode = 'ok';

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

createServer(async (req, res) => {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  const body = raw ? JSON.parse(raw) : {};

  if (req.method === 'GET' && req.url === '/__sent') return json(res, 200, sent);
  if (req.method === 'POST' && req.url === '/__reset') {
    sent = [];
    mode = 'ok';
    return json(res, 200, { ok: true });
  }
  if (req.method === 'POST' && req.url === '/__mode') {
    mode = body.mode;
    return json(res, 200, { mode });
  }
  if (req.method === 'POST' && req.url === '/emails') {
    sent.push({ ...body, authorization: req.headers.authorization ? 'present' : 'missing' });
    if (mode === 'fail' || mode === 'flaky') {
      if (mode === 'flaky') mode = 'ok';
      return json(res, 500, { name: 'application_error', statusCode: 500, message: 'Mock failure' });
    }
    return json(res, 200, { id: `mock_${sent.length}` });
  }
  return json(res, 404, { error: 'not found' });
}).listen(port, () => console.log(`mock resend listening on ${port}`));
