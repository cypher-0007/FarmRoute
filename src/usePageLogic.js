import { useCallback, useEffect, useState } from 'react';

function parseActionArguments(source) {
  const values = [];
  const pattern = /(['"])(.*?)\1|\b(true|false|null|\d+(?:\.\d+)?)\b/g;
  let match;
  while ((match = pattern.exec(source))) {
    if (match[1]) values.push(match[2]);
    else if (match[3] === 'true') values.push(true);
    else if (match[3] === 'false') values.push(false);
    else if (match[3] === 'null') values.push(null);
    else values.push(Number(match[3]));
  }
  return values;
}

/** Mount page-specific Firebase and interaction modules only after the React DOM exists. */
export function usePageLogic({ title, logicOrder, initializers }) {
  const [actions, setActions] = useState({});

  useEffect(() => {
    let active = true;
    const cleanups = [];
    document.title = title;

    async function initializePage() {
      const availableActions = {};
      for (const [kind, name] of logicOrder) {
        try {
          if (kind === 'external') {
            const script = document.createElement('script');
            script.src = name;
            script.async = true;
            document.body.appendChild(script);
            cleanups.push(() => script.remove());
            continue;
          }

          const result = initializers[name]?.();
          if (typeof result === 'function') cleanups.push(result);
          else if (result && typeof result === 'object') Object.assign(availableActions, result);
        } catch (error) {
          console.error(`Failed to initialize ${name} on ${title}`, error);
        }
      }
      if (active) setActions(availableActions);
    }

    initializePage();
    return () => {
      active = false;
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, [title, logicOrder, initializers]);

  return useCallback((event) => {
    const target = event.target.closest?.('[data-legacy-click]');
    if (!target) return;
    const expression = target.getAttribute('data-legacy-click') || '';
    const location = expression.match(/^\s*window\.location\.href\s*=\s*(['"])(.*?)\1\s*$/);
    if (location) {
      window.location.assign(new URL(location[2], window.location.href).href);
      return;
    }
    const action = expression.match(/^\s*([A-Za-z_$][\w$]*)\s*\((.*)\)\s*$/);
    const callback = action && actions[action[1]];
    if (callback) callback(...parseActionArguments(action[2]), event);
  }, [actions]);
}
