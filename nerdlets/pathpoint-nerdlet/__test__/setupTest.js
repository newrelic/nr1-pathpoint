import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

process.on('unhandledRejection', reason => {
  throw reason;
});

configure({ adapter: new Adapter() });
