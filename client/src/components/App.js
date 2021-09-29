
import '../../src/App.css';
import React from 'react';
import {NavLink,BrowserRouter as Router,Route} from 'react-router-dom'
import Home from './Home';
import MyBin from './MyBin';
import MyPosts from './MyPosts'
import NewPost from './NewPost'
import Popularity from './Popularity';
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';




const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  
  return (
    <ApolloProvider client={client}>
    <Router>
      <div>
        <header className="App-header">
          <h1 className="App-title">
            Welcom to Binterest!
          </h1>
          <nav>
            <NavLink className="navlink" to="/">
              Home
            </NavLink>
            <br/>
             <NavLink className="navlink" to="/my-bins">
              My Bins
            </NavLink>
            <br/>
            <NavLink className="navlink" to="/my-posts">
              My Posts
            </NavLink>
            <br/>
            <NavLink className="navlink" to="/new-post">
              New Post
            </NavLink>
            <br/>
            <NavLink className="navlink" to="/popularity">
              Popularity
            </NavLink>

           
          </nav>
        </header>
        <Route exact path="/" component={Home} />
        <Route exact path="/page/:page" component={Home} />
        <Route path="/my-bins" component={MyBin} />
        <Route path="/my-posts" component={MyPosts} />
        <Route path="/new-post" component={NewPost} /> 
        <Route path="/popularity" component={Popularity} /> 
      </div>
    </Router>
  </ApolloProvider>
  );
}

export default App;
