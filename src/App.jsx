import { Suspense } from "react";
import { useRecoilValue } from "recoil";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Toaster } from "react-hot-toast";

import { isDarkAtom } from "./atoms/isDarkAtom";
import { GlobalStyles, lightTheme, darkTheme } from "./styled";
import Navbar from "./Componenets/Navbar";
import Home from "./Routes/Home";
import Auth from "./Routes/Auth";
import Me from "./Routes/Me";
import Posts from "./Routes/Posts";
import Post from "./Routes/Post";
import OnlyUserRoute from "./Componenets/OnlyUserRoute";
import Loader from "./Componenets/Loader";
import PostUpdate from "./Routes/PostUpdate";
import PostUpload from "./Routes/PostUpload";
import ProMain from "./Routes/ProMain";
import ProRegister from "./Routes/ProRegister";
import Pro from "./Routes/Pro";
import ProUpdate from "./Routes/ProUpdate";
import Messenger from "./Routes/Messenger";

function App() {
    const isDark = useRecoilValue(isDarkAtom);

    return (
        <BrowserRouter>
            <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
                <GlobalStyles />
                <Navbar />
                <Switch>
                    <Route exact path="/" render={() => <Home />} />
                    <Route path="/auth" render={() => <Auth />} />
                    <Route
                        exact
                        path="/messenger"
                        render={() => (
                            <OnlyUserRoute>
                                <Messenger />
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts"
                        render={() => (
                            <OnlyUserRoute>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <Posts />
                                </Suspense>
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts/upload"
                        render={() => (
                            <OnlyUserRoute>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <PostUpload />
                                </Suspense>
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts/:id"
                        render={() => (
                            <OnlyUserRoute>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <Post />
                                </Suspense>
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/posts/:id/update"
                        render={() => (
                            <OnlyUserRoute>
                                <Suspense
                                    fallback={<Loader width="50px" height="50px" />}
                                >
                                    <PostUpdate />
                                </Suspense>
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/me"
                        render={() => (
                            <OnlyUserRoute>
                                <Me />
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/pro"
                        render={() => (
                            <OnlyUserRoute>
                                <ProMain />
                            </OnlyUserRoute>
                        )}
                    />
                    <Route
                        exact
                        path="/pro/register"
                        render={() => (
                            <OnlyUserRoute>
                                <ProRegister />
                            </OnlyUserRoute>
                        )}
                    />

                    <Route
                        exact
                        path="/pro/:id"
                        render={() => (
                            <OnlyUserRoute>
                                <Pro />
                            </OnlyUserRoute>
                        )}
                    ></Route>
                    <Route
                        exact
                        path="/pro/:id/update"
                        render={() => (
                            <OnlyUserRoute>
                                <ProUpdate />
                            </OnlyUserRoute>
                        )}
                    ></Route>
                </Switch>
                <Toaster />
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
