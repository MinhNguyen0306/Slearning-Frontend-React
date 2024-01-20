import routes from "./routes/routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageWrapper from "./components/PageWrapper";
import 'swiper/css';
import 'react-toastify/ReactToastify.css';
import 'react-toastify/ReactToastify.min.css';
import 'react-circular-progressbar/dist/styles.css';
import 'react-tooltip/dist/react-tooltip.css';
import "react-datepicker/dist/react-datepicker.css";
import { onMessageListener, requestToken } from "./firebase";
import { useEffect } from "react";

function App() {
  // useEffect(() => {
  //   requestToken()
  // }, [])
  useEffect(() => {
    onMessageListener().then((data: any) => {
      console.log("Receive foreground: ", data)
      const title = data.notification.title
      const options = {
        body: data.notification?.body,
        icon: data.notification?.image
      };
    
      new Notification(title, options);
    })
  })

    return (
      <BrowserRouter>
        <Routes>
          {
            routes.map((route) => {
              let layout = route.layout ? route.layout : null

              return (
                layout !== null ? (
                  <Route key={route.path} element={layout}>
                    <Route path={route.path} element={
                      route.state ? (
                        <PageWrapper state={route.state}>{route.element}</PageWrapper>
                      ) : route.element }
                    >
                      {
                        route.children?.map((child) => (
                          child.index ? (
                            <Route key={child.path} index path={child.path} element={
                              child.state ? (
                                <PageWrapper state={child.state}>{child.element}</PageWrapper>
                              ) : child.element
                            } />
                          ) : (
                            <Route key={child.path} path={child.path} element={
                              child.state ? (
                                <PageWrapper state={child.state}>{child.element}</PageWrapper>
                              ) : child.element
                            } />
                          )
                        ))
                      }
                    </Route>
                  </Route>
                ) : (
                  <Route key={route.path} path={route.path} element = {route.element} />
                )
              )
            })
          }
        </Routes>
      </BrowserRouter>
    );
}

export default App;
