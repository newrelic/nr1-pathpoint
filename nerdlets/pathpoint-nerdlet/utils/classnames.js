/**
 * Define the classes to a component
 * @param {(string | null)[]} arrClasses Array with component classes
 * @return {string} string
 */
export default function classnames(arrClasses) {
  const classes = arrClasses.filter(item => typeof item === 'string'); // Filter string values

  // 'classes' is empty array, return empty string or join each element with empty space
  return classes.length === 0 ? '' : classes.join(' ');
}
