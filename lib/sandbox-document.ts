type SandboxDocumentOptions = {
  readonly maxCodeLength: number;
  readonly maxMessages: number;
  readonly version: number;
  readonly workerTimeoutMs: number;
};

export function serializeForInlineScript(value: string | number): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/'/g, "\\u0027")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function createSandboxDocument(nonce: string, options: SandboxDocumentOptions): string {
  const encodedNonce = serializeForInlineScript(nonce);
  const encodedMaxCodeLength = serializeForInlineScript(options.maxCodeLength);
  const encodedMaxMessages = serializeForInlineScript(options.maxMessages);
  const encodedVersion = serializeForInlineScript(options.version);
  const encodedWorkerTimeout = serializeForInlineScript(options.workerTimeoutMs);
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; connect-src 'none'; img-src 'none'; media-src 'none'; font-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'; worker-src blob:; script-src 'unsafe-inline' 'unsafe-eval'"></head><body><script>
  (() => {
    'use strict';
    const VERSION = ${encodedVersion};
    const NONCE = ${encodedNonce};
    const LIMIT = ${encodedWorkerTimeout};
    let port = null;
    let worker = null;
    let timer = null;
    let workerUrl = null;

    const cleanup = () => {
      if (timer !== null) clearTimeout(timer);
      timer = null;
      if (worker) worker.terminate();
      worker = null;
      if (workerUrl) URL.revokeObjectURL(workerUrl);
      workerUrl = null;
    };

    const workerMain = () => {
      'use strict';
      // Capture every intrinsic used by trusted evaluation before student code can mutate globals.
      const NativeObject = Object;
      const NativeArray = Array;
      const NativeJSON = JSON;
      const NativeError = Error;
      const NativeBoolean = Boolean;
      const NativeString = String;
      const NativeUint8Array = Uint8Array;
      const objectIs = NativeObject.is;
      const objectKeys = NativeObject.keys;
      const getOwnPropertyDescriptor = NativeObject.getOwnPropertyDescriptor;
      const defineProperty = NativeObject.defineProperty;
      const arrayIsArray = NativeArray.isArray;
      const jsonStringify = NativeJSON.stringify;
      const cryptoRandom = crypto.getRandomValues.bind(crypto);
      const nativePostMessage = self.postMessage.bind(self);
      const AsyncFunction = NativeObject.getPrototypeOf(async function () {}).constructor;
      const messages = [];
      let runId = '';

      const primitive = (value) => {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return value.length > 1000 ? value.slice(0, 1000) + '…' : value;
        if (typeof value === 'number') return objectIs(value, -0) ? '-0' : NativeString(value);
        if (typeof value === 'bigint') return NativeString(value) + 'n';
        if (typeof value === 'boolean') return NativeString(value);
        if (typeof value === 'symbol') return '[Symbol]';
        if (typeof value === 'function') return '[Function]';
        return null;
      };
      const serialize = (value, depth = 0, seen = new Set()) => {
        const simple = primitive(value);
        if (simple !== null) return simple;
        if (depth >= 4) return '[Max depth]';
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
        try {
          if (value instanceof NativeError) return value.name + ': ' + value.message;
          const keys = objectKeys(value).slice(0, 30);
          const parts = keys.map((key) => {
            const descriptor = getOwnPropertyDescriptor(value, key);
            const item = descriptor && 'value' in descriptor ? serialize(descriptor.value, depth + 1, seen) : '[Accessor]';
            return jsonStringify(key) + ': ' + item;
          });
          return arrayIsArray(value) ? '[' + parts.map((part) => part.replace(/^"\\d+": /, '')).join(', ') + ']' : '{' + parts.join(', ') + '}';
        } catch { return '[Unserializable]'; }
      };
      const add = (kind, values) => {
        if (messages.length >= ${encodedMaxMessages}) return;
        messages.push({ kind, text: values.map((value) => serialize(value)).join(' ').slice(0, 4000) });
      };
      const blocked = ['fetch', 'fetchLater', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts', 'Worker', 'SharedWorker', 'Blob', 'File', 'FileReader', 'webkitURL'];
      for (const name of blocked) {
        try { defineProperty(globalThis, name, { value: undefined, writable: false, configurable: false }); } catch {}
      }
      try { defineProperty(URL, 'createObjectURL', { value: undefined, writable: false, configurable: false }); } catch {}
      try { defineProperty(URL, 'revokeObjectURL', { value: undefined, writable: false, configurable: false }); } catch {}
      try { if (globalThis.navigator) defineProperty(globalThis.navigator, 'sendBeacon', { value: undefined, writable: false, configurable: false }); } catch {}
      console.log = (...values) => add('log', values);
      console.warn = (...values) => add('warn', values);
      console.error = (...values) => add('error', values);
      addEventListener('error', (event) => { add('error', [event.error || event.message]); });
      addEventListener('unhandledrejection', (event) => { event.preventDefault(); add('error', ['Unhandled rejection:', event.reason]); });

      const deepEqual = (left, right, depth = 0) => {
        if (objectIs(left, right)) return true;
        if (depth >= 20 || left === null || right === null || typeof left !== 'object' || typeof right !== 'object') return false;
        if (arrayIsArray(left) !== arrayIsArray(right)) return false;
        try {
          const leftKeys = objectKeys(left);
          const rightKeys = objectKeys(right);
          if (leftKeys.length !== rightKeys.length) return false;
          for (const key of leftKeys) {
            if (!rightKeys.includes(key)) return false;
            const leftDescriptor = getOwnPropertyDescriptor(left, key);
            const rightDescriptor = getOwnPropertyDescriptor(right, key);
            if (!leftDescriptor || !rightDescriptor || !('value' in leftDescriptor) || !('value' in rightDescriptor) || !deepEqual(leftDescriptor.value, rightDescriptor.value, depth + 1)) return false;
          }
          return true;
        } catch { return false; }
      };
      const randomHex = (size) => {
        const bytes = cryptoRandom(new NativeUint8Array(size));
        let value = '';
        for (let index = 0; index < bytes.length; index += 1) value += bytes[index].toString(16).padStart(2, '0');
        return value;
      };
      const sourceValue = (value) => {
        const encoded = jsonStringify(value);
        return encoded === undefined ? 'undefined' : encoded.replace(/</g, '\\\\u003c').replace(/\\u2028/g, '\\\\u2028').replace(/\\u2029/g, '\\\\u2029');
      };

      self.onmessage = async (event) => {
        const request = event.data;
        if (!request || request.version !== ${encodedVersion} || request.type !== 'execute' || typeof request.code !== 'string' || !arrayIsArray(request.tests)) return;
        runId = request.runId;
        try {
          if (request.tests.length === 0) {
            let execute;
            let capturesExpression = false;
            try {
              execute = new AsyncFunction('"use strict"; return await (' + request.code + ');');
              capturesExpression = true;
            } catch {
              execute = new AsyncFunction('"use strict"; ' + request.code + '\\nreturn [];');
            }
            const output = await execute();
            if (capturesExpression && output !== undefined) add('result', [output]);
            nativePostMessage({ runId, messages, tests: [] });
            return;
          }

          const expectedTests = request.tests.map((test) => NativeObject.freeze({ id: test.id, label: test.label }));
          NativeObject.freeze(expectedTests);
          const capability = randomHex(32);
          const recorded = new NativeArray(expectedTests.length);
          let rejected = false;
          const record = (token, id, label, assertion, actual, expected, completed) => {
            if (token !== capability || typeof id !== 'string' || typeof label !== 'string' || typeof completed !== 'boolean') { rejected = true; return; }
            let index = -1;
            for (let position = 0; position < expectedTests.length; position += 1) {
              if (expectedTests[position].id === id) { index = position; break; }
            }
            if (index < 0 || expectedTests[index].label !== label || recorded[index] !== undefined) { rejected = true; return; }
            let passed = false;
            if (!completed) passed = false;
            else if (assertion === 'truthy') passed = NativeBoolean(actual);
            else if (assertion === 'deepEqual') passed = deepEqual(actual, expected);
            else if (assertion === 'equal') passed = objectIs(actual, expected);
            else { rejected = true; return; }
            recorded[index] = { id, label, passed, actual: serialize(actual) };
          };
          const finishRecording = () => {
            if (rejected) return [];
            for (let index = 0; index < recorded.length; index += 1) if (recorded[index] === undefined) return [];
            return recorded;
          };

          const recorderName = '$rec_' + randomHex(16);
          const tokenName = '$cap_' + randomHex(16);
          const studentName = '$run_' + randomHex(16);
          const actualName = '$actual_' + randomHex(16);
          const errorName = '$error_' + randomHex(16);
          const harness = request.tests.map((test) => {
            const identity = sourceValue(test.id) + ',' + sourceValue(test.label) + ',' + sourceValue(test.assertion);
            return 'try { const ' + actualName + ' = await (' + test.expression + '); ' + recorderName + '(' + tokenName + ',' + identity + ',' + actualName + ',' + sourceValue(test.expected) + ',true); } catch (' + errorName + ') { ' + recorderName + '(' + tokenName + ',' + identity + ',' + errorName + ',' + sourceValue(test.expected) + ',false); }';
          }).join('\\n');
          const body = '"use strict"; const ' + studentName + ' = async function () { "use strict";\\n' + request.code + '\\n;' + harness + '\\n}; await ' + studentName + '();';
          const execute = new AsyncFunction(recorderName, tokenName, body);
          await execute(record, capability);
          nativePostMessage({ runId, messages, tests: finishRecording() });
        } catch (error) {
          add('error', [error]);
          nativePostMessage({ runId, messages, tests: [] });
        }
      };
    };

    const run = (request) => {
      cleanup();
      const source = '(' + workerMain.toString() + ')();';
      workerUrl = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
      worker = new Worker(workerUrl);
      const finish = (payload, timedOut) => {
        if (!port || request.runId !== payload.runId) return;
        port.postMessage({ version: VERSION, type: 'result', nonce: NONCE, runId: request.runId, messages: payload.messages || [], tests: payload.tests || [], timedOut });
        cleanup();
      };
      worker.onmessage = (event) => finish(event.data, false);
      worker.onerror = (event) => finish({ runId: request.runId, messages: [{ kind: 'error', text: event.message }], tests: [] }, false);
      timer = setTimeout(() => finish({ runId: request.runId, messages: [{ kind: 'error', text: 'Tiempo límite excedido (' + LIMIT + ' ms).' }], tests: [] }, true), LIMIT);
      worker.postMessage({ version: VERSION, type: 'execute', runId: request.runId, code: request.code, tests: request.tests });
    };

    addEventListener('message', (event) => {
      if (event.source !== parent || !event.data || event.data.version !== VERSION || event.data.type !== 'connect' || event.data.nonce !== NONCE || typeof event.data.connectionId !== 'string' || event.ports.length !== 1) return;
      if (port) port.close();
      port = event.ports[0];
      port.onmessage = (message) => {
        const request = message.data;
        if (!request || request.version !== VERSION || request.type !== 'run' || request.nonce !== NONCE || typeof request.runId !== 'string' || typeof request.code !== 'string' || request.code.length > ${encodedMaxCodeLength} || !Array.isArray(request.tests)) return;
        run(request);
      };
      port.start();
      port.postMessage({ version: VERSION, type: 'connected', nonce: NONCE, connectionId: event.data.connectionId });
    });
    parent.postMessage({ version: VERSION, type: 'ready', nonce: NONCE }, '*');
  })();
  </script></body></html>`;
}
