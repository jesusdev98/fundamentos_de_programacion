import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v314.0.4/full/pyodide.mjs";

const VERSION = 1;
const INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.4/full/";
const EXPECTED_PYTHON = "3.14.2";
const MAX_MESSAGES = 100;
const MAX_TEXT = 4_000;

const HARNESS = String.raw`
import builtins
import json
import traceback

_namespace = {"__name__": "__main__"}
_tests = json.loads(__runner_tests_json)
_results = []
_error = None
_original_input = builtins.input

def _blocked_input(*args, **kwargs):
    raise RuntimeError("input() no está disponible en este entorno")

def _actual_text(value):
    try:
        return repr(value)[:1000]
    except Exception:
        return "<valor no representable>"

try:
    builtins.input = _blocked_input
    exec(__runner_code, _namespace)
    for _spec in _tests:
        try:
            _actual = eval(_spec["expression"], _namespace)
            if _spec["assertion"] == "raises":
                _passed = False
            elif _spec["assertion"] == "truthy":
                _passed = bool(_actual)
            else:
                _passed = _actual == _spec.get("expected")
            _results.append({"id": _spec["id"], "label": _spec["label"], "passed": _passed, "actual": _actual_text(_actual)})
        except BaseException as _test_error:
            _passed = _spec["assertion"] == "raises" and type(_test_error).__name__ == _spec.get("expected")
            _results.append({"id": _spec["id"], "label": _spec["label"], "passed": _passed, "actual": "".join(traceback.format_exception_only(type(_test_error), _test_error)).strip()[:1000]})
except BaseException as _run_error:
    _error = "".join(traceback.format_exception_only(type(_run_error), _run_error)).strip()
finally:
    builtins.input = _original_input

json.dumps({"tests": _results, "error": _error}, ensure_ascii=False)
`;

let pyodide;

function blockCapabilities() {
  for (const name of ["fetch", "fetchLater", "XMLHttpRequest", "WebSocket", "EventSource", "importScripts", "Worker", "SharedWorker"]) {
    try { Object.defineProperty(globalThis, name, { value: undefined, writable: false, configurable: false }); } catch {}
  }
  try { if (globalThis.navigator) Object.defineProperty(globalThis.navigator, "sendBeacon", { value: undefined, writable: false, configurable: false }); } catch {}
}

function addMessage(messages, kind, text) {
  if (messages.length < MAX_MESSAGES) messages.push({ kind, text: String(text).slice(0, MAX_TEXT) });
}

async function initialize() {
  try {
    pyodide = await loadPyodide({ indexURL: INDEX_URL, packages: [] });
    const pythonVersion = pyodide.runPython("import platform; platform.python_version()");
    if (pythonVersion !== EXPECTED_PYTHON) throw new Error(`Versión de Python inesperada: ${pythonVersion}`);
    blockCapabilities();
    self.postMessage({ version: VERSION, type: "ready", pythonVersion });
  } catch (error) {
    self.postMessage({ version: VERSION, type: "initialization-error", message: error instanceof Error ? error.message : String(error) });
  }
}

self.onmessage = async (event) => {
  const request = event.data;
  if (!pyodide || !request || request.version !== VERSION || request.type !== "run" || typeof request.runId !== "string" || typeof request.code !== "string" || !Array.isArray(request.tests)) return;
  const messages = [];
  pyodide.setStdout({ batched: (text) => addMessage(messages, "log", text) });
  pyodide.setStderr({ batched: (text) => addMessage(messages, "error", text) });
  pyodide.globals.set("__runner_code", request.code);
  pyodide.globals.set("__runner_tests_json", JSON.stringify(request.tests));
  try {
    const serialized = await pyodide.runPythonAsync(HARNESS);
    const outcome = JSON.parse(serialized);
    if (outcome.error) addMessage(messages, "error", outcome.error);
    self.postMessage({ version: VERSION, type: "result", runId: request.runId, messages, tests: outcome.tests });
  } catch (error) {
    addMessage(messages, "error", error instanceof Error ? error.message : String(error));
    self.postMessage({ version: VERSION, type: "result", runId: request.runId, messages, tests: [] });
  }
};

initialize();
