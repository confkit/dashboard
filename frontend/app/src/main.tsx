import { attach } from '@fukict/basic';
import { App } from './App';
import './styles/index.css';

const root = document.getElementById('root');
if (root) {
  attach(<App />, root);
}
