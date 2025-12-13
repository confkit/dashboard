import { Fukict } from '@fukict/basic';
import { RouterProvider } from '@fukict/router';
import { routes } from './routes';

export class App extends Fukict {
  render() {
    return (
      <RouterProvider
        mode="history"
        routes={routes}
        beforeEach={(to, from, next) => {
          if (to.meta?.title) {
            document.title = `${to.meta.title} | Confkit Dashboard`;
          }
          next();
        }}
      />
    );
  }
}
