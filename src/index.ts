import { Plugin } from 'vite';
import YAML from 'js-yaml';

/**
 * judge if is custom block in vue component file
 * @date 2022-06-30
 * @param id:string
 * @returns judge result
 */
function isCustomBlock(id: string) {
  return /type=i18n/i.test(id);
}

// only support json or yaml file
const supportedExtReg = /\.(ya?ml|json)$/;

/**
 * Transform the code into assignment.
 *
 * @param varName the variable name.
 * @param code the code to transform.
 * @returns the transformed code.
 */
function transformCode(varName: string, code: string) {
  const assignmentPrefix = `const ${varName} =`;
  const codeTrimed = code.trim();
  if (codeTrimed.startsWith('{')) {
    return `${assignmentPrefix} ${codeTrimed};`;
  } else {
    try {
      const data = YAML.load(codeTrimed);
      return `${assignmentPrefix} ${JSON.stringify(data)};`;
    } catch (err) {
      return codeTrimed.replace(/export default/, assignmentPrefix);
    }
  }
}

/**
 * Create the i18n plugin.
 *
 * @returns the i18n plugin.
 */
export function createI18nPlugin(): Plugin {
  return {
    name: 'yfwz100:vite-plugin-vue2-i18n',
    transform(code: string, id: string) {
      if (isCustomBlock(id) || supportedExtReg.test(id)) {
        const value = transformCode('__i18n', code.trim());
        let newCode =
          value +
          `export default function i18n(Component) {\n` +
          `  const options = Component.options || Component\n` +
          `  options.__i18n = options.__i18n || []\n` +
          `  options.__i18n.push(JSON.stringify(__i18n))\n` +
          `}`;
        if (!isCustomBlock(id)) {
          newCode = value + `export default __i18n`;
        }
        return {
          code: newCode,
          map: {
            mappings: '',
          },
        };
      }
    },
  };
}
