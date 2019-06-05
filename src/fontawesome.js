import { library, dom } from '@fortawesome/fontawesome-svg-core';
// Import specific icons required
import {
  faChevronRight,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';


// Add specific icons required
library.add(
  faCircleNotch,
  faChevronRight
);

// Replace any existing <i> tags with <svg> and set up a MutationObserver to
// continue doing this as the DOM changes.
export default () => dom.watch();