import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastContainer } from "react-toastify";
import { Provider } from 'react-redux';
import store from "./redux/store.ts";
import {
   QueryClient,
   QueryClientProvider
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
   // <React.StrictMode>
      <Provider store={store}>
         <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
            <ToastContainer 
               position='top-center'
               autoClose={2000}
               hideProgressBar={true}
               newestOnTop={true}
               theme='light'
               closeButton={false}
               style={{ 
                  zIndex: 99999,
                  textAlign: 'center'
               }}
            />
         </QueryClientProvider>
      </Provider>
   // </React.StrictMode>
);
