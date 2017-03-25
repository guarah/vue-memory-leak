'use strict';
import { app, router, store } from './index';



// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {

  const startTime = process.env.NODE_ENV !== 'production' && Date.now();

  return new Promise((resolve, reject) => {
    // set router's location
    router.push(context.url);

    // wait until router has resolved possible async hooks
    router.onReady(() => {


      // get all components that are matched by the router's rules
      const matchedComponents = router.getMatchedComponents();
      // get all child components of components matched by the router's rules
      const matchedChildren = [];
      matchedComponents.forEach(component => {
        if (component.components) {
          Object.keys(component.components).forEach(subcomponentKey => {
            matchedChildren.push(component.components[subcomponentKey]);
          });
        }
      });
      const matchedComponentsWithChildren = [...matchedComponents, ...matchedChildren];

      // no matched routes
      if (!matchedComponents.length) {
        reject({ code: 404 })
      }

      // Call preFetch hooks on components matched by the route.
      // A preFetch hook dispatches a store action and returns a Promise,
      // which is resolved when the action is complete and store state has been
      // updated.
      return Promise.all(matchedComponentsWithChildren.map(component => {
        if (component.preFetch) {
          return component.preFetch(store, router);
        }

      })).then(() => {
        startTime && console.log(`data pre-fetch: ${Date.now() - startTime}ms`);
        // After all preFetch hooks are resolved, our store is now
        // filled with the state needed to render the app.
        // Expose the state on the render context, and let the request handler
        // inline the state in the HTML response. This allows the client-side
        // store to pick-up the server-side state without having to duplicate
        // the initial data fetching on the client.
        context.state = store.state;
        resolve(app);

      }).catch(reject);

    });
  });

}